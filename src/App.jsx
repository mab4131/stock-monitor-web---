import { MantineProvider, AppShell, Header, Title, Container } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import StockGrid from './components/StockGrid';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppShell
          padding="md"
          header={
            <Header height={60} p="xs">
              <Title order={1}>Stock Volume Monitor</Title>
            </Header>
          }
        >
          <Container size="xl">
            <StockGrid />
          </Container>
        </AppShell>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
