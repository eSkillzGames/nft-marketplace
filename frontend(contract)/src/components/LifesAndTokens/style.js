import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

const styles = createStyles({
  hero: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '36px 0 48px',
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      '&:first-child': {
        '& > span': {
          width: '30%',
          border: '1px solid #0F3D4B',
        },
        '& > div': {
          width: '40%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          color: 'white',
          '& > div': {
            display: 'flex',
            alignItems: 'center',
            '& > img': {
              width: '24px',
              marginRight: '8px',
            },
            '& p': {
              margin: '0',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '1',
            },
            '& > div': {
              display: 'flex',
              flexDirection: 'column',
              '& > span': {
                fontSize: '9px',
                fontWeight: '600',
                color: '#849297',
              },
            },
          },
        },
      },
    },
  },
});

export default styles;