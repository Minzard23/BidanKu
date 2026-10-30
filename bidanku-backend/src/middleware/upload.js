import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads'),
  filename: (req, file, cb) => {
    const unik = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unik + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;