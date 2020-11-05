import { Toast } from '@ant-design/react-native';
function showToast(text) {
  Toast.info(text, 1, false);
}
export default showToast;