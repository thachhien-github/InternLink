[System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null

$docxPath = "e:\Downloads\internlink\frontend\public\Bao cao tong ket cong tac thuc tap tot nghiep C22A.docx"
$xlsxPath = "e:\Downloads\internlink\frontend\public\DANH SACH THUC TAP C23.xlsx"

Write-Host "=================== DOCX INSPECTION ==================="
if (Test-Path $docxPath) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
    $entry = $zip.GetEntry("word/document.xml")
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $xmlContent = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        $xml = [xml]$xmlContent
        # Extract text nodes
        $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
        $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
        
        $paragraphs = $xml.SelectNodes("//w:p", $ns)
        foreach ($p in $paragraphs) {
            $t = $p.InnerText.Trim()
            if ($t) {
                Write-Host $t
            }
        }
    }
    $zip.Dispose()
}

Write-Host "`n=================== XLSX INSPECTION ==================="
if (Test-Path $xlsxPath) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxPath)
    
    # Read shared strings
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
    
    # Read workbook for sheet names
    $wbEntry = $zip.GetEntry("xl/workbook.xml")
    if ($wbEntry) {
        $stream = $wbEntry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $wbXml = [xml]$reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $ns = New-Object System.Xml.XmlNamespaceManager($wbXml.NameTable)
        $ns.AddNamespace("s", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
        $sheets = $wbXml.SelectNodes("//s:sheet", $ns)
        foreach ($s in $sheets) {
            Write-Host "Found Sheet: $($s.name) (Id: $($s.sheetId), rId: $($s.id))"
        }
    }
    
    # Read sheet1.xml
    $sheet1Entry = $zip.GetEntry("xl/worksheets/sheet1.xml")
    if ($sheet1Entry) {
        $stream = $sheet1Entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $sheetXml = [xml]$reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        $ns = New-Object System.Xml.XmlNamespaceManager($sheetXml.NameTable)
        $ns.AddNamespace("s", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
        $rows = $sheetXml.SelectNodes("//s:row", $ns)
        
        Write-Host "Total rows in Sheet1: $($rows.Count)"
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
            Write-Host "Row $rowNum -> $($rowVals -join ' | ')"
            $count++
            if ($count -ge 20) { break }
        }
    }
    
    $zip.Dispose()
}
