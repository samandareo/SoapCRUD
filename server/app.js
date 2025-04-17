import express from 'express';
import youtubedl from 'youtube-dl-exec';

const app = express();

app.use(express.json());

app.post('/video', async (req, res) => {
  try {
    const url = req.body.url;
    const info = await youtubedl(url, { getUrl: true, format: 'mp4' });
    res.send(info);
  } catch (error) {
    res.status(500).send('Error processing video');
  }
});     

app.listen(3000, () => console.log('Server running'));