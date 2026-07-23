<#
.SYNOPSIS
    Deploy global config to the target AI tool's location.

.DESCRIPTION
    Copies global/ content from ai-workspace to the tool's expected location.
    Source of truth is always ~/ai-workspace/global/.

.PARAMETER Agent
    AI tool to deploy to: claude (default), windsurf.

.EXAMPLE
    .\deploy.ps1
    .\deploy.ps1 -Agent windsurf
#>

param(
    [ValidateSet("claude", "windsurf")]
    [string]$Agent = "claude"
)

$ErrorActionPreference = "Stop"
$Source = (Resolve-Path (Join-Path $PSScriptRoot "..\..\global")).Path

switch ($Agent) {
    "claude" {
        $Target = "$env:USERPROFILE\.claude"

        # Ensure target directories exist
        New-Item -ItemType Directory -Force -Path "$Target\commands" | Out-Null
        New-Item -ItemType Directory -Force -Path "$Target\agents" | Out-Null
        New-Item -ItemType Directory -Force -Path "$Target\skills" | Out-Null

        # Copy config files
        Copy-Item "$Source\CLAUDE.md" "$Target\CLAUDE.md" -Force
        Copy-Item "$Source\about-me.md" "$Target\about-me.md" -Force
        Copy-Item "$Source\settings.json" "$Target\settings.json" -Force

        # Copy all commands
        Copy-Item "$Source\commands\*" "$Target\commands\" -Force -Recurse

        # Copy all agents (if any)
        Copy-Item "$Source\agents\*" "$Target\agents\" -Force -Recurse -ErrorAction SilentlyContinue

        # Copy all skills (if any)
        Copy-Item "$Source\skills\*" "$Target\skills\" -Force -Recurse -ErrorAction SilentlyContinue

        Write-Host "Deployed to $Target"
        Write-Host "  CLAUDE.md, about-me.md, settings.json"
        Write-Host "  commands/ ($((Get-ChildItem "$Target\commands" -File).Count) files)"
        Write-Host "  agents/   ($((Get-ChildItem "$Target\agents" -File -ErrorAction SilentlyContinue).Count) files)"
        Write-Host "  skills/   ($((Get-ChildItem "$Target\skills" -File -ErrorAction SilentlyContinue).Count) files)"
    }
    "windsurf" {
        $WindsurfPath = "$env:USERPROFILE\.codeium\windsurf"
        $DevinPath = "$env:USERPROFILE\.devin"

        if (Test-Path $WindsurfPath) {
            $Target = $WindsurfPath
            $WorkflowsDir = "$Target\global_workflows"
        } else {
            $Target = $DevinPath
            $WorkflowsDir = "$Target\workflows"
        }

        # Ensure target directories exist
        New-Item -ItemType Directory -Force -Path $WorkflowsDir | Out-Null

        # Copy config files
        Copy-Item "$Source\CLAUDE.md" "$Target\CLAUDE.md" -Force
        Copy-Item "$Source\AGENTS.md" "$Target\AGENTS.md" -Force
        Copy-Item "$Source\about-me.md" "$Target\about-me.md" -Force
        Copy-Item "$Source\settings.json" "$Target\settings.json" -Force

        # Copy commands → workflows (same content, different folder name)
        Copy-Item "$Source\commands\*" "$WorkflowsDir\" -Force -Recurse

        Write-Host "Deployed to $Target"
        Write-Host "  CLAUDE.md, AGENTS.md, about-me.md, settings.json"
        Write-Host "  workflows/ ($((Get-ChildItem "$WorkflowsDir" -File).Count) files)"
    }
}
