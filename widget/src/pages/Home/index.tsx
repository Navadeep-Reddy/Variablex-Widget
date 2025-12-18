import { CalculatorWidget } from '../../components/CalculatorWidget';

export function Home() {
	return (
		<CalculatorWidget
			configurationId="20"
			apiBaseUrl="http://139.59.2.52:8080"
		/>
	);
}
