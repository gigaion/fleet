import React, { useContext, useState } from "react";
import { isEmpty } from "lodash";

import { APP_CONTEXT_NO_TEAM_ID } from "interfaces/team";
import { NotificationContext } from "context/notification";
import configAPI from "services/entities/config";
import teamsAPI from "services/entities/teams";

// @ts-ignore
import InputField from "components/forms/fields/InputField";
import Button from "components/buttons/Button";
import validatePresence from "components/forms/validators/validate_presence";
import { ApplePlatform } from "interfaces/platform";

const baseClass = "apple-os-target-form";

interface IAppleOSTargetFormData {
  minOsVersion: string;
  deadline: string;
}

interface IAppleOSTargetFormErrors {
  minOsVersion?: string;
  deadline?: string;
}

const validateMinVersion = (value: string) => {
  return /^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,2}$/.test(value);
};

const validateDeadline = (value: string) => {
  return /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(value);
};

const validateForm = (formData: IAppleOSTargetFormData) => {
  const errors: IAppleOSTargetFormErrors = {};

  if (!validatePresence(formData.minOsVersion)) {
    errors.minOsVersion = "The minimum version is required.";
  } else if (!validateMinVersion(formData.minOsVersion)) {
    errors.minOsVersion = "Minimum version must meet criteria below.";
  }

  if (!validatePresence(formData.deadline)) {
    errors.deadline = "The deadline is required.";
  } else if (!validateDeadline(formData.deadline)) {
    errors.deadline = "Deadline must meet criteria below.";
  }

  return errors;
};

interface IAppleUpdatesMdmConfigData {
  mdm: {
    macos_updates?: {
      minimum_version: string;
      deadline: string;
    };
    ipados_updates?: {
      minimum_version: string;
      deadline: string;
    };
    ios_updates?: {
      minimum_version: string;
      deadline: string;
    };
  };
}

const createMdmConfigData = (
  applePlatform: ApplePlatform,
  minOsVersion: string,
  deadline: string
): IAppleUpdatesMdmConfigData => {
  if (applePlatform === "darwin") {
    return {
      mdm: {
        macos_updates: {
          minimum_version: minOsVersion,
          deadline,
        },
      },
    };
  }
  if (applePlatform === "ios") {
    return {
      mdm: {
        ios_updates: {
          minimum_version: minOsVersion,
          deadline,
        },
      },
    };
  }
  return {
    mdm: {
      ipados_updates: {
        minimum_version: minOsVersion,
        deadline,
      },
    },
  };
};

interface IAppleOSTargetFormProps {
  currentTeamId: number;
  applePlatform: ApplePlatform;
  defaultMinOsVersion: string;
  defaultDeadline: string;
  refetchAppConfig: () => void;
  refetchTeamConfig: () => void;
}

const AppleOSTargetForm = ({
  currentTeamId,
  applePlatform,
  defaultMinOsVersion,
  defaultDeadline,
  refetchAppConfig,
  refetchTeamConfig,
}: IAppleOSTargetFormProps) => {
  const { renderFlash } = useContext(NotificationContext);

  const [isSaving, setIsSaving] = useState(false);
  const [minOsVersion, setMinOsVersion] = useState(defaultMinOsVersion);
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [minOsVersionError, setMinOsVersionError] = useState<
    string | undefined
  >();
  const [deadlineError, setDeadlineError] = useState<string | undefined>();

  // FIXME: This behaves unexpectedly when a user switches tabs or changes the teams dropdown while the form is
  // submitting because this component is unmounted.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm({
      minOsVersion,
      deadline,
    });

    setMinOsVersionError(errors.minOsVersion);
    setDeadlineError(errors.deadline);

    if (isEmpty(errors)) {
      setIsSaving(true);
      const updateData = createMdmConfigData(
        applePlatform,
        minOsVersion,
        deadline
      );
      try {
        currentTeamId === APP_CONTEXT_NO_TEAM_ID
          ? await configAPI.update(updateData)
          : await teamsAPI.update(updateData, currentTeamId);
        renderFlash("success", "Successfully updated minimum version!");
      } catch {
        renderFlash("error", "Couldn’t update. Please try again.");
      } finally {
        currentTeamId === APP_CONTEXT_NO_TEAM_ID
          ? refetchAppConfig()
          : refetchTeamConfig();
        setIsSaving(false);
      }
    }
  };

  const handleMinVersionChange = (val: string) => {
    setMinOsVersion(val);
  };

  const handleDeadlineChange = (val: string) => {
    setDeadline(val);
  };

  const getMinimumVersionTooltip = (platform: ApplePlatform) => {
    if (platform === "darwin") {
      return "The end user sees the window until their macOS is at or above this version.";
    }
    if (platform === "ios" || platform === "ipados") {
      return "If the end user's host is below the minimum version, they see a notification in their Notification Center after the deadline. They can’t continue until the OS update is installed.";
    }
    return "";
  };

  const getDeadlineTooltip = (platform: ApplePlatform) => {
    if (platform === "darwin") {
      return "The end user can’t dismiss the window once they reach this deadline. Deadline is at 12:00 (Noon) Pacific Standard Time (GMT-8).";
    }
    if (platform === "ios" || platform === "ipados") {
      return "Deadline is at 12:00 (Noon) Pacific Standard Time (GMT-8).";
    }
    return "";
  };

  return (
    <form className={baseClass} onSubmit={handleSubmit}>
      <InputField
        label="Minimum version"
        tooltip={getMinimumVersionTooltip(applePlatform)}
        helpText="Version number only (e.g., “13.0.1” not “Ventura 13” or “13.0.1 (22A400)”)"
        placeholder="13.0.1"
        value={minOsVersion}
        error={minOsVersionError}
        onChange={handleMinVersionChange}
      />
      <InputField
        label="Deadline"
        tooltip={getDeadlineTooltip(applePlatform)}
        helpText="YYYY-MM-DD format only (e.g., “2023-06-01”)."
        placeholder="2023-06-01"
        value={deadline}
        error={deadlineError}
        onChange={handleDeadlineChange}
      />
      <Button type="submit" isLoading={isSaving}>
        Save
      </Button>
    </form>
  );
};

export default AppleOSTargetForm;
