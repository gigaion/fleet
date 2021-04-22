// Automatically generated by mockimpl. DO NOT EDIT!

package mock

import "github.com/fleetdm/fleet/server/kolide"

var _ kolide.UserStore = (*UserStore)(nil)

type NewUserFunc func(user *kolide.User) (*kolide.User, error)

type UserFunc func(username string) (*kolide.User, error)

type ListUsersFunc func(opt kolide.UserListOptions) ([]*kolide.User, error)

type UserByEmailFunc func(email string) (*kolide.User, error)

type UserByIDFunc func(id uint) (*kolide.User, error)

type SaveUserFunc func(user *kolide.User) error

type DeleteUserFunc func(id uint) error

type PendingEmailChangeFunc func(userID uint, newEmail string, token string) error

type ConfirmPendingEmailChangeFunc func(userID uint, token string) (string, error)

type UserStore struct {
	NewUserFunc        NewUserFunc
	NewUserFuncInvoked bool

	UserFunc        UserFunc
	UserFuncInvoked bool

	ListUsersFunc        ListUsersFunc
	ListUsersFuncInvoked bool

	UserByEmailFunc        UserByEmailFunc
	UserByEmailFuncInvoked bool

	UserByIDFunc        UserByIDFunc
	UserByIDFuncInvoked bool

	SaveUserFunc        SaveUserFunc
	SaveUserFuncInvoked bool

	DeleteUserFunc        DeleteUserFunc
	DeleteUserFuncInvoked bool

	PendingEmailChangeFunc        PendingEmailChangeFunc
	PendingEmailChangeFuncInvoked bool

	ConfirmPendingEmailChangeFunc        ConfirmPendingEmailChangeFunc
	ConfirmPendingEmailChangeFuncInvoked bool
}

func (s *UserStore) NewUser(user *kolide.User) (*kolide.User, error) {
	s.NewUserFuncInvoked = true
	return s.NewUserFunc(user)
}

func (s *UserStore) User(username string) (*kolide.User, error) {
	s.UserFuncInvoked = true
	return s.UserFunc(username)
}

func (s *UserStore) ListUsers(opt kolide.UserListOptions) ([]*kolide.User, error) {
	s.ListUsersFuncInvoked = true
	return s.ListUsersFunc(opt)
}

func (s *UserStore) UserByEmail(email string) (*kolide.User, error) {
	s.UserByEmailFuncInvoked = true
	return s.UserByEmailFunc(email)
}

func (s *UserStore) UserByID(id uint) (*kolide.User, error) {
	s.UserByIDFuncInvoked = true
	return s.UserByIDFunc(id)
}

func (s *UserStore) SaveUser(user *kolide.User) error {
	s.SaveUserFuncInvoked = true
	return s.SaveUserFunc(user)
}

func (s *UserStore) DeleteUser(id uint) error {
	s.DeleteUserFuncInvoked = true
	return s.DeleteUserFunc(id)
}

func (s *UserStore) PendingEmailChange(userID uint, newEmail string, token string) error {
	s.PendingEmailChangeFuncInvoked = true
	return s.PendingEmailChangeFunc(userID, newEmail, token)
}

func (s *UserStore) ConfirmPendingEmailChange(userID uint, token string) (string, error) {
	s.ConfirmPendingEmailChangeFuncInvoked = true
	return s.ConfirmPendingEmailChangeFunc(userID, token)
}
