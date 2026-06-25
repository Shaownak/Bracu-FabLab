"""
Custom permission classes for role-based access control.
"""

from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Allow access only to admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_superuser)
        )


class IsStudentUser(permissions.BasePermission):
    """Allow access to students."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["student", "admin"]
        )


class IsFacultyUser(permissions.BasePermission):
    """Allow access to faculty."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["faculty", "admin"]
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow access to the owner of the object or admin."""

    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin" or request.user.is_superuser:
            return True
        if hasattr(obj, "user"):
            return obj.user == request.user
        return obj == request.user


class ReadOnlyOrAdmin(permissions.BasePermission):
    """Allow read-only access to all, write access to admins."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_superuser)
        )
