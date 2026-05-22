from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box

console = Console()

table = Table(title="Midnight Gospel SDD Pipeline", box=box.ROUNDED, style="cyan")
table.add_column("Phase", justify="left", style="magenta", no_wrap=True)
table.add_column("Status", justify="center", style="green")

table.add_row("Constitution", "[bold green]PASS[/bold green]")
table.add_row("Specify (Level 1)", "[bold green]PASS[/bold green]")
table.add_row("Plan", "[bold green]PASS[/bold green]")
table.add_row("Tasks", "[bold green]PASS[/bold green]")
table.add_row("Implement", "[bold green]PASS[/bold green]")
table.add_row("Specify (Level 2)", "[bold yellow]PENDING[/bold yellow]")

panel = Panel(
    table,
    title="[bold blue]Antigravity System Status[/bold blue]",
    subtitle="Level 1 Zombie Capitol is LIVE",
    expand=False,
    border_style="green"
)

console.print("\n")
console.print(panel)
console.print("\n[bold yellow]Ready to execute your next directive...[/bold yellow]\n")
