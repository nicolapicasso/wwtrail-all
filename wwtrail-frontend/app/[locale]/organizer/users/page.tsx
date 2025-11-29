'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Users,
  User,
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Crown,
  Mail,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Star,
  Copy,
  Check,
  Globe,
  Lock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService, AdminUser } from '@/lib/api/admin.service';
import { COUNTRIES } from '@/lib/utils/countries';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador', icon: Crown, color: 'text-red-600 bg-red-100' },
  { value: 'ORGANIZER', label: 'Organizador', icon: ShieldCheck, color: 'text-blue-600 bg-blue-100' },
  { value: 'ATHLETE', label: 'Atleta', icon: UserCheck, color: 'text-green-600 bg-green-100' },
  { value: 'VIEWER', label: 'Visitante', icon: User, color: 'text-gray-600 bg-gray-100' },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const locale = useLocale();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [insiderFilter, setInsiderFilter] = useState(false);

  // Dialogs
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  // Create user form
  const [createUserForm, setCreateUserForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    role: 'ATHLETE',
    country: '',
    gender: '',
  });
  const [createdUserPassword, setCreatedUserPassword] = useState<string | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Edit user form
  const [editUserForm, setEditUserForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '',
    gender: '',
  });

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        page,
        limit: 20,
      };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.isActive = statusFilter === 'active';
      if (insiderFilter) params.isInsider = true;

      const { users: usersData, pagination: paginationData } = await adminService.getAllUsers(params);
      setUsers(usersData);
      setPagination({
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        totalUsers: paginationData.totalUsers,
      });
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, insiderFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
  };

  const handleOpenRoleDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setEditUserForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      country: user.country || '',
      gender: user.gender || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setEditUserForm({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      country: '',
      gender: '',
    });
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      await adminService.updateUser(selectedUser.id, editUserForm);
      await fetchUsers(pagination.currentPage);
      handleCloseEditDialog();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Error al actualizar el usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    setActionLoading(true);
    try {
      await adminService.updateUserRole(selectedUser.id, newRole);
      await fetchUsers(pagination.currentPage);
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Error updating role:', err);
      setError(err.response?.data?.message || 'Error al actualizar el rol');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    setActionLoading(true);
    try {
      await adminService.toggleUserStatus(user.id);
      await fetchUsers(pagination.currentPage);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setError(err.response?.data?.message || 'Error al cambiar el estado');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      await adminService.deleteUser(selectedUser.id);
      await fetchUsers(pagination.currentPage);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Error al eliminar el usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!createUserForm.email || !createUserForm.username || !createUserForm.firstName || !createUserForm.role) {
      setError('Por favor completa los campos obligatorios: email, username, nombre y rol');
      return;
    }

    setActionLoading(true);
    try {
      const result = await adminService.createUser(createUserForm);
      setCreatedUserPassword(result.generatedPassword);
      await fetchUsers(1);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || 'Error al crear el usuario');
      setIsCreateDialogOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setCreatedUserPassword(null);
    setPasswordCopied(false);
    setCreateUserForm({
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      role: 'ATHLETE',
      country: '',
      gender: '',
    });
  };

  const handleCopyPassword = () => {
    if (createdUserPassword) {
      navigator.clipboard.writeText(createdUserPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  const handleToggleInsider = async (user: AdminUser) => {
    setActionLoading(true);
    try {
      await adminService.toggleInsiderStatus(user.id);
      await fetchUsers(pagination.currentPage);
    } catch (err: any) {
      console.error('Error toggling insider status:', err);
      setError(err.response?.data?.message || 'Error al cambiar el estado de Insider');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublic = async (user: AdminUser) => {
    setActionLoading(true);
    try {
      await adminService.togglePublicStatus(user.id);
      await fetchUsers(pagination.currentPage);
    } catch (err: any) {
      console.error('Error toggling public status:', err);
      setError(err.response?.data?.message || 'Error al cambiar la visibilidad del perfil');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleOption = ROLE_OPTIONS.find((r) => r.value === role);
    if (!roleOption) return null;
    const Icon = roleOption.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleOption.color}`}>
        <Icon className="w-3 h-3" />
        {roleOption.label}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios de la plataforma
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => fetchUsers(pagination.currentPage)} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Usuario
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button onClick={() => setError(null)} className="text-red-600 text-sm underline mt-1">
            Cerrar
          </button>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-40">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Todos los roles</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            <label className="flex items-center gap-2 px-3 py-2 border border-input bg-background rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={insiderFilter}
                onChange={(e) => setInsiderFilter(e.target.checked)}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
              <Star className={`w-4 h-4 ${insiderFilter ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              <span className="text-sm">Solo Insiders</span>
            </label>
            <Button type="submit" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{pagination.totalUsers}</p>
              <p className="text-sm text-gray-500">Total usuarios</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">
                {(users || []).filter((u) => u.role === 'ADMIN').length}
              </p>
              <p className="text-sm text-gray-500">Administradores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">
                {(users || []).filter((u) => u.role === 'ORGANIZER').length}
              </p>
              <p className="text-sm text-gray-500">Organizadores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">
                {(users || []).filter((u) => u.role === 'ATHLETE').length}
              </p>
              <p className="text-sm text-gray-500">Atletas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({pagination.totalUsers})</CardTitle>
          <CardDescription>
            Página {pagination.currentPage} de {pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (users || []).length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Rol</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Registro</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                              {user.avatar ? (
                                <Image
                                  src={user.avatar}
                                  alt={user.fullName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.fullName || user.username}
                              </p>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600">{user.email}</span>
                        </td>
                        <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {user.isActive ? (
                              <>
                                <Activity className="w-3 h-3" />
                                Activo
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3" />
                                Inactivo
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600 text-sm">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleOpenEditDialog(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar usuario
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenRoleDialog(user)}>
                                <Shield className="w-4 h-4 mr-2" />
                                Cambiar rol
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleInsider(user)}>
                                <Star className={`w-4 h-4 mr-2 ${user.isInsider ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                {user.isInsider ? 'Quitar Insider' : 'Hacer Insider'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTogglePublic(user)}>
                                {user.isPublic ? (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Hacer privado
                                  </>
                                ) : (
                                  <>
                                    <Globe className="w-4 h-4 mr-2 text-green-600" />
                                    Hacer público
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                {user.isActive ? (
                                  <>
                                    <UserX className="w-4 h-4 mr-2" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenDeleteDialog(user)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Mostrando {(pagination.currentPage - 1) * 20 + 1} -{' '}
                  {Math.min(pagination.currentPage * 20, pagination.totalUsers)} de{' '}
                  {pagination.totalUsers} usuarios
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar rol de usuario</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>Cambiando el rol de <strong>{selectedUser.fullName || selectedUser.username}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role">Nuevo rol</Label>
            <select
              id="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole} disabled={actionLoading}>
              {actionLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>{selectedUser?.fullName || selectedUser?.username}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !open && handleCloseCreateDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
            <DialogDescription>
              {createdUserPassword
                ? 'Usuario creado exitosamente. Guarda la contraseña generada.'
                : 'Completa los datos del nuevo usuario'}
            </DialogDescription>
          </DialogHeader>

          {createdUserPassword ? (
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium mb-2">Usuario creado correctamente</p>
                <p className="text-sm text-green-700">
                  Contraseña generada (cópiala antes de cerrar):
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 px-3 py-2 bg-white border rounded text-sm font-mono">
                    {createdUserPassword}
                  </code>
                  <Button variant="outline" size="sm" onClick={handleCopyPassword}>
                    {passwordCopied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button className="w-full" onClick={handleCloseCreateDialog}>
                Cerrar
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={createUserForm.firstName}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, firstName: e.target.value })}
                      placeholder="Juan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input
                      id="lastName"
                      value={createUserForm.lastName}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, lastName: e.target.value })}
                      placeholder="García"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createUserForm.email}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario *</Label>
                  <Input
                    id="username"
                    value={createUserForm.username}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, username: e.target.value })}
                    placeholder="juangarcia"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol *</Label>
                  <select
                    id="role"
                    value={createUserForm.role}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <select
                      id="country"
                      value={createUserForm.country}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, country: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Seleccionar...</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <select
                      id="gender"
                      value={createUserForm.gender}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="MALE">Hombre</option>
                      <option value="FEMALE">Mujer</option>
                      <option value="NON_BINARY">No binario</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  * Campos obligatorios. Se generará una contraseña aleatoria que podrás enviar al usuario.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseCreateDialog} disabled={actionLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} disabled={actionLoading}>
                  {actionLoading ? 'Creando...' : 'Crear Usuario'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && handleCloseEditDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Modificando los datos de <strong>{selectedUser?.fullName || selectedUser?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">Nombre</Label>
                <Input
                  id="editFirstName"
                  value={editUserForm.firstName}
                  onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Apellidos</Label>
                <Input
                  id="editLastName"
                  value={editUserForm.lastName}
                  onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
                  placeholder="García"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editUsername">Nombre de usuario</Label>
              <Input
                id="editUsername"
                value={editUserForm.username}
                onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                placeholder="juangarcia"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editCountry">País</Label>
                <select
                  id="editCountry"
                  value={editUserForm.country}
                  onChange={(e) => setEditUserForm({ ...editUserForm, country: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editGender">Género</Label>
                <select
                  id="editGender"
                  value={editUserForm.gender}
                  onChange={(e) => setEditUserForm({ ...editUserForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar...</option>
                  <option value="MALE">Hombre</option>
                  <option value="FEMALE">Mujer</option>
                  <option value="NON_BINARY">No binario</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} disabled={actionLoading}>
              {actionLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
