export const updateDialogHeight = (availableHeight: number, dialogClass: string) => {
  const dialogOverlayEl = document.querySelector(`.v-dialog.${dialogClass}`) as HTMLElement
  if (!dialogOverlayEl) {
    return
  }
  dialogOverlayEl.style.maxHeight = availableHeight + 'px'
  dialogOverlayEl.style.marginTop = '0'
}