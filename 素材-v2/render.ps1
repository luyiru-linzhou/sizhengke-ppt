# Render 誓与密码共存亡-v2.pptx to per-slide PNGs via PowerPoint COM.
# Opens the deck READ-ONLY; never calls Quit.
$ErrorActionPreference = 'Stop'
$src = 'C:\Users\29264\Desktop\思政课ppt\素材-v2\out\誓与密码共存亡-v2.pptx'
$out = 'C:\Users\29264\Desktop\思政课ppt\素材-v2\render'
New-Item -ItemType Directory -Force -Path $out | Out-Null
Get-ChildItem "$out\*.png" -ErrorAction SilentlyContinue | Remove-Item

$app  = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($src, $true, $false, $false)
try {
  Write-Output ("SLIDES=" + $pres.Slides.Count)
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $p = Join-Path $out ("slide-{0:D2}.png" -f $i)
    $pres.Slides.Item($i).Export($p, 'PNG', 1600, 900)
    Write-Output ("WROTE slide-{0:D2}" -f $i)
  }
} finally {
  $pres.Close()
}
Write-Output 'DONE'
