# bisect.ps1 — find which slide makes PowerPoint reject the v2 deck.
# Builds decks with slides [1..n], opens each via COM, bisects the range.
$ErrorActionPreference = 'Stop'
Set-Location 'C:\Users\29264\Desktop\思政课ppt\素材-v2'
$src = Get-Content 'build_deck.js' -Raw -Encoding UTF8
$rangePptx = 'C:/Users/29264/AppData/Local/Temp/dmrender/range.pptx'

function Build-Range([int]$n) {
  $names = ((1..$n) | ForEach-Object { "s$_" }) -join ', '
  $js = [regex]::Replace($src, '\[s1,[^\]]*\]\.forEach\(f => f\(\)\);',
    "[$names].forEach(f => f());")
  $js = $js -replace '誓与密码共存亡-v2\.pptx', 'range.pptx'
  $js = $js -replace 'path\.join\(ROOT, "out", "range\.pptx"\)',
    ('"' + $rangePptx + '"')
  Set-Content 'build_range.js' $js -Encoding UTF8
  node build_range.js 2>$null | Out-Null
}

$app = New-Object -ComObject PowerPoint.Application
function Test-Range([int]$n) {
  Build-Range $n
  if (Test-Path $rangePptx) { Remove-Item $rangePptx -Force }
  Build-Range $n
  try {
    $p = $app.Presentations.Open($rangePptx, $true, $false, $false)
    $p.Close()
    return $true
  } catch { return $false }
}

# first confirm full deck fails and 1 works
Write-Output ("full(13) opens: " + (Test-Range 13))
$lo = 1; $hi = 13
while ($lo -lt $hi) {
  $mid = [math]::Ceiling(($lo + $hi) / 2.0)
  $ok = Test-Range $mid
  Write-Output ("range 1..{0} opens: {1}" -f $mid, $ok)
  if ($ok) { $lo = $mid } else { $hi = $mid - 1 }
}
Write-Output ("LAST GOOD = " + $lo + " ; FIRST BAD slide = " + ($lo + 1))
