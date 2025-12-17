import { CalculatorWidget } from '../../components/CalculatorWidget';

export function Home() {
	return (
		<CalculatorWidget
			userId="1"
			configurationId="12"
			apiBaseUrl="http://localhost:8080"
		/>
	);
}
