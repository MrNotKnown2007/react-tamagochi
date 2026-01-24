# Скрипт для автоматической замены абсолютных путей на пути с BASE_URL

$files = Get-ChildItem -Path "src" -Include "*.tsx","*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Проверяем, есть ли в файле абсолютные пути к изображениям
    if ($content -match 'src="/' -or $content -match "src='/" -or $content -match 'return\s+[''"]/' -or $content -match 'getAssetPath') {
        Write-Host "Processing: $($file.Name)"
        
        # Добавляем импорт getAssetPath если его нет
        if ($content -notmatch 'import.*getAssetPath') {
            # Находим первый import
            $content = $content -replace '(import\s+.*?\n)', "`$1import { getAssetPath } from '../utils/assetPath'`n"
        }
        
        # Заменяем src="/..." на src={getAssetPath("/...")}
        $content = $content -replace 'src="(/[^"]+)"', 'src={getAssetPath("$1")}'
        $content = $content -replace "src='(/[^']+)'", 'src={getAssetPath("$1")}'
        
        # Заменяем return "/..." на return getAssetPath("/...")
        $content = $content -replace 'return\s+([''"])(/[^''"]+)\1', 'return getAssetPath("$2")'
        
        Set-Content $file.FullName -Value $content -NoNewline
    }
}

Write-Host "Done!"
