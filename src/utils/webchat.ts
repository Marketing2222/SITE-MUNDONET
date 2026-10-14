export function openOpaChat(): boolean {
  const ico = document.querySelector('.opa_ico') as HTMLElement | null;
  if (!ico) return false;
  ico.click();
  return true;
}
