import INDEX from '../pages/index.jsx';
import DETAIL from '../pages/detail.jsx';
import UPLOAD from '../pages/upload.jsx';
import PROFILE from '../pages/profile.jsx';
import SETTINGS from '../pages/settings.jsx';
import EDIT_PROFILE from '../pages/edit-profile.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "detail",
  component: DETAIL
}, {
  id: "upload",
  component: UPLOAD
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "settings",
  component: SETTINGS
}, {
  id: "edit-profile",
  component: EDIT_PROFILE
}]