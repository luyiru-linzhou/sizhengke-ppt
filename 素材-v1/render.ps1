# Render 誓与密码共存亡-v1.pptx to per-slide PNGs via PowerPoint COM.
# SAFETY: opens the deck READ-ONLY, closes only the presentation it opened,
# and never calls Quit (PowerPoint is already running with the user's own file open).
param([string]$Deck = 'C:\Users\29264\Desktop\思政课ppt\素材-v1\out\誓与密码共存亡-v3.pptx',
      [string]$OutDir = 'C:\Users\29264\Desktop\思政课ppt\素材-v1\render')
$ErrorActionPreference = 'Stop'
$src  = $Deck
$out  = $OutDir
New-Item -ItemType Directory -Force -Path $out | Out-Null
Get-ChildItem "$out\*.png" -ErrorAction SilentlyContinue | Remove-Item

$app  = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($src, $true, $false, $false)   # ReadOnly, Untitled, NoWindow
try {
  Write-Output ("SLIDES=" + $pres.Slides.Count)
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $p = Join-Path $out ("slide-{0:D2}.png" -f $i)
    $pres.Slides.Item($i).Export($p, 'PNG', 1600, 900)
    Write-Output ("WROTE " + $p)
  }
} finally {
  $pres.Close()
}
Write-Output 'DONE (PowerPoint left running on purpose)'
