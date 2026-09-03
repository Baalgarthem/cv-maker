!macro NSIS_HOOK_POSTINSTALL
  SetOutPath "$INSTDIR"
  File "${__FILEDIR__}\WebView2Loader.dll"
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  Delete "$INSTDIR\WebView2Loader.dll"
!macroend
