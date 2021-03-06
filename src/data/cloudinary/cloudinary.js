import cloudinary from 'cloudinary';
import ApollosConfig from '@apollosproject/config';

const { CLOUDINARY } = ApollosConfig;
// Cloudinary picks up settings from `env`,
// no way to pass straight into config if using `CLOUDINARY_URL format`
// Exposed as Utiliy function to reset config (mostly used in tests)
export function config() {
  process.env.CLOUDINARY_URL = CLOUDINARY.URL;
  cloudinary.config(true);
  cloudinary.config({
    private_cdn: false,
    secure: true,
  });
}
// we always want to setup the config on boot.
config();

const cleanUrl = (url) => {
  const clean = url.replace(/:(443|80)/, '');
  const rootpath = clean.replace(
    'https://images.crossings.church/fit-in/700x700/Images/',
    'oldweb/'
  );
  const urlpath = rootpath.replace('Web/', '');
  return urlpath;
};

export default function withCloudinary(_url = '', options) {
  const url = cleanUrl(_url);
  // If we call this function twice, only the first transform will be applied
  if (url.startsWith('https://res.cloudinary.com')) {
    return url;
  }
  if (CLOUDINARY.URL) {
    return cloudinary.url(url, {
      fetch_format: 'auto',
      width: 'auto',
      crop: 'scale',
      quality: 'auto',
      dpr: 'auto',
      responsive: true,
      ...options,
    });
  }
  return url;
}

export { cloudinary };
