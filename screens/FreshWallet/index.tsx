import {observer} from 'mobx-react-lite';
import {ComingSoon} from '../../components/ComingSoon';
import {useNetWorkContext} from '@/providers/NetworkProvider';

export const FreshWallet = observer(() => {
    const {NETWORK_CONFIG} = useNetWorkContext()
    return <ComingSoon title={`${NETWORK_CONFIG.NAME} Fresh Wallet feature`}/>;
});
