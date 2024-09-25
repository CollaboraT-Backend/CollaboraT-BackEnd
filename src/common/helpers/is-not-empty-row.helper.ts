export function isNotEmptyRow(row: ICollaboratorRow): boolean {
  return (
    row.name.trim() !== '' ||
    row.email.trim() !== '' ||
    row.role.trim() !== '' ||
    row.occupation.trim() !== ''
  );
}
