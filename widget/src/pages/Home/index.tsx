import { CalculatorWidget } from '../../components/CalculatorWidget';

export function Home() {
	return (
		<CalculatorWidget
			userId="1"
			configurationId="20"
			apiBaseUrl="http://139.59.2.52:8080"
		/>
	);
}
