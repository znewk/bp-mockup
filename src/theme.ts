import type { ThemeConfig } from 'antd';

/**
 * Токены Ant Design, подогнанные под ng-zorro-тему основного проекта:
 * кнопки/инпуты #02AEF0, радиус 7-8px, шрифт Inter.
 */
export const bpTheme: ThemeConfig = {
  token: {
    colorPrimary: '#02AEF0',
    colorInfo: '#02AEF0',
    colorSuccess: '#2EB761',
    colorError: '#CC244C',
    colorTextBase: '#1B1B1B',
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    borderRadius: 7,
    controlHeight: 40,
  },
  components: {
    Button: { borderRadius: 7, fontWeight: 500 },
    Card: { borderRadiusLG: 12 },
    Modal: { borderRadiusLG: 15 },
    Input: { borderRadius: 7 },
  },
};
