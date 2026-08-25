[System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$xlsxPath = "e:\Downloads\internlink\frontend\public\DANH SACH THUC TAP C23.xlsx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxPath)

$sharedStrings = @()
$ssEntry = $zip.GetEntry("xl/sharedStrings.xml")
if ($ssEntry) {
    $stream = $ssEntry.Open()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
    $ssXml = [xml]$reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $ns = New-Object System.Xml.XmlNamespaceManager($ssXml.NameTable)
    $ns.AddNamespace("s", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
    $siNodes = $ssXml.SelectNodes("//s:si", $ns)
    foreach ($si in $siNodes) {
        $sharedStrings += $si.InnerText
    }
}

# Inspect sheet2 (DATABASE) and sheet3 (TEN CONG TY)
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "xl/worksheets/sheet*.xml") {
        Write-Host "`n=== $($entry.FullName) ==="
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $sheetXml = [xml]$reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        $ns = New-Object System.Xml.XmlNamespaceManager($sheetXml.NameTable)
        $ns.AddNamespace("s", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
        $rows = $sheetXml.SelectNodes("//s:row", $ns)
        Write-Host "Total rows: $($rows.Count)"
        $count = 0
        foreach ($r in $rows) {
            $rowNum = $r.r
            $cells = $r.SelectNodes("s:c", $ns)
            $rowVals = @()
            foreach ($c in $cells) {
                $cellRef = $c.r
                $type = $c.t
                $val = ""
                $vNode = $c.SelectSingleNode("s:v", $ns)
                if ($vNode) {
                    $vVal = $vNode.InnerText
                    if ($type -eq "s") {
                        $idx = [int]$vVal
                        if ($idx -ge 0 -and $idx -lt $sharedStrings.Count) {
                            $val = $sharedStrings[$idx]
                        } else {
                            $val = $vVal
                        }
                    } else {
                        $val = $vVal
                    }
                }
                $rowVals += "$($cellRef): $val"
            }
            Write-Host "Row $($rowNum) -> $($rowVals -join ' | ')"
            $count++
            if ($count -ge 10) { break }
        }
    }
}
$zip.Dispose()
