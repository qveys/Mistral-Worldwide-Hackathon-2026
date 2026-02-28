# setup-git-autopilot.ps1
# ──────────────────────────────────────────────────────────────────────────────
# Enregistre git-autopilot.py comme tâche planifiée Windows (toutes les minutes)
# Usage :  .\setup-git-autopilot.ps1 [-ApiKey "sk-ant-..."] [-Uninstall]
# ──────────────────────────────────────────────────────────────────────────────

param(
    [string]$ApiKey   = "",       # Clé Anthropic API pour la résolution LLM (optionnel)
    [switch]$Uninstall = $false   # Supprimer la tâche
)

$TaskName    = "GitAutopilot-Mistral"
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptPath  = Join-Path $ScriptDir "git-autopilot.py"
$LogFile     = Join-Path $ScriptDir "git-autopilot.log"
$Python      = (Get-Command python -ErrorAction SilentlyContinue)?.Source `
               ?? (Get-Command python3 -ErrorAction SilentlyContinue)?.Source `
               ?? "python"

# ── Désinstallation ──────────────────────────────────────────────────────────
if ($Uninstall) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "✓ Tâche '$TaskName' supprimée." -ForegroundColor Green
    exit 0
}

# ── Vérifications ────────────────────────────────────────────────────────────
if (-not (Test-Path $ScriptPath)) {
    Write-Error "Script introuvable : $ScriptPath"
    exit 1
}

# S'assurer qu'anthropic est installé
Write-Host "Installation des dépendances Python..." -ForegroundColor Cyan
& $Python -m pip install anthropic --quiet 2>$null

# ── Construire la commande ───────────────────────────────────────────────────
$EnvPrefix = ""
if ($ApiKey) {
    $EnvPrefix = "`$env:ANTHROPIC_API_KEY='$ApiKey'; "
}
$Cmd = "$EnvPrefix& '$Python' '$ScriptPath' >> '$LogFile' 2>&1"

# ── Créer la tâche planifiée ─────────────────────────────────────────────────
$Action  = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NonInteractive -WindowStyle Hidden -Command `"$Cmd`""

# Répétition toutes les minutes, indéfiniment
$Trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 1) `
    -Once -At (Get-Date)

$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 2) `
    -MultipleInstances IgnoreNew `
    -StartWhenAvailable

$Principal = New-ScheduledTaskPrincipal `
    -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
    -RunLevel Highest

# Supprimer l'ancienne tâche si elle existe
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

Register-ScheduledTask `
    -TaskName  $TaskName `
    -Action    $Action `
    -Trigger   $Trigger `
    -Settings  $Settings `
    -Principal $Principal `
    -Description "Synchronisation automatique du dépôt GitHub (git pull / commit / push) — toutes les minutes" `
    | Out-Null

Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host " ✓  Tâche '$TaskName' enregistrée avec succès !"  -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  Répertoire  : $ScriptDir"   -ForegroundColor Cyan
Write-Host "  Script      : $ScriptPath"  -ForegroundColor Cyan
Write-Host "  Logs        : $LogFile"     -ForegroundColor Cyan
Write-Host "  Fréquence   : toutes les minutes"
if ($ApiKey) {
    Write-Host "  LLM         : ✓ Anthropic API configurée" -ForegroundColor Green
} else {
    Write-Host "  LLM         : ⚠ Pas de clé API — mode heuristique" -ForegroundColor Yellow
    Write-Host "    → Relance avec : .\setup-git-autopilot.ps1 -ApiKey 'sk-ant-...'" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "  Commandes utiles :"
Write-Host "    Lancer manuellement : python '$ScriptPath'"
Write-Host "    Voir les logs       : Get-Content '$LogFile' -Tail 50"
Write-Host "    Désinstaller        : .\setup-git-autopilot.ps1 -Uninstall"
Write-Host ""
