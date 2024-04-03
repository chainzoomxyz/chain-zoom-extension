import {observer} from 'mobx-react-lite';
import {ComingSoon} from '@/components/ComingSoon';
import {useNetWorkContext} from '@/providers/NetworkProvider';

export const TopHolder = observer(() => {
    const {NETWORK_CONFIG} = useNetWorkContext();
    return <ComingSoon title={`${NETWORK_CONFIG.NAME} Top Holders feature`}/>;
});
