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

$wbEntry = $zip.GetEntry("xl/workbook.xml")
if ($wbEntry) {
    $stream = $wbEntry.Open()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
    $wbXml = [xml]$reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $ns = New-Object System.Xml.XmlNamespaceManager($wbXml.NameTable)
    $ns.AddNamespace("s", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
    Write-Host "=== SHEETS IN WORKBOOK ==="
    foreach ($sheet in $wbXml.SelectNodes("//s:sheet", $ns)) {
        Write-Host "Sheet: name='$($sheet.name)' sheetId='$($sheet.sheetId)' rId='$($sheet.GetAttribute("id", "http://schemas.openxmlformats.org/officeDocument/2006/relationships"))'"
    }
}

foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "xl/worksheets/sheet*.xml") {
        Write-Host "`n================ $($entry.FullName) ================"
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $sheetXml = [xml]$reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        $ns = New-Object System.Xml.XmlNamespaceManager($sheetXml.NameTable)
        $ns.AddNamespace("s", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
        
        $rows = $sheetXml.SelectNodes("//s:row", $ns)
        Write-Host "Total rows: $($rows.Count)"
        foreach ($r in $rows) {
            $rowNum = [int]$r.r
            $formulas = @()
            $cells = @()
            foreach ($c in $r.SelectNodes("s:c", $ns)) {
                $ref = $c.r
                $f = $c.SelectSingleNode("s:f", $ns)
                $v = $c.SelectSingleNode("s:v", $ns)
                $val = ""
                if ($v) {
                    $t = $c.t
                    if ($t -eq "s") {
                        $idx = [int]$v.InnerText
                        if ($idx -ge 0 -and $idx -lt $sharedStrings.Count) { $val = $sharedStrings[$idx] }
                        else { $val = $v.InnerText }
                    } else {
                        $val = $v.InnerText
                    }
                }
                if ($f) {
                    $formulas += "$($ref)=$($f.InnerText) (val: $val)"
                }
                if ($val -ne "") {
                    $cells += "$($ref): $val"
                }
            }
            if ($rowNum -le 5 -or $rowNum -ge 55) {
                if ($cells.Count -gt 0) {
                    Write-Host "Row $rowNum cells: $($cells -join ' | ')"
                }
                if ($formulas.Count -gt 0) {
                    Write-Host "Row $rowNum formulas: $($formulas -join '; ')"
                }
            }
        }
    }
}
$zip.Dispose()
