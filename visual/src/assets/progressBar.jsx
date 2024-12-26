import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getProgressColor } from './utils';  // 유틸리티 함수 가져오기
import { styles } from './style'; // 스타일 가져오기

const ProgressBar = ({ progress }) => {
  return (
    <div style={styles.progressContainer}>
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={buildStyles({
          pathColor: getProgressColor(progress),
          textColor: '#000',
          trailColor: '#e0e0e0',
        })}
        strokeWidth={8}
        style={{ height: '100px', width: '100px' }}
      />
    </div>
  );
};

export default ProgressBar;