import { CalculatorWidget } from '../../components/CalculatorWidget';

export function Home() {
	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-6xl mx-auto">
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">Variablex Widget Demo</h1>
					<p className="text-muted-foreground">
						Testing API fetching with userId=1, configurationId=10
					</p>
				</header>

				<div className="bg-card border border-border rounded-lg p-6">
					<CalculatorWidget
						userId="1"
						configurationId="10"
						apiBaseUrl="http://localhost:8080"
					/>
				</div>

				<footer className="mt-8 text-center text-sm text-muted-foreground">
					<p>This widget fetches calculator schemas from the API and renders with exact Variablex preview mode styling</p>
				</footer>
			</div>
		</div>
	);
}
