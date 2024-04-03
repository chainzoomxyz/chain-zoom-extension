import { PopupContent } from '@/popup/PopupContent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomThemeProvider } from '@/theme';

const queryClient = new QueryClient();

function IndexPopup() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <PopupContent />
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}

export default IndexPopup;
