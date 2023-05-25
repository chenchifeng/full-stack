import { Input } from 'antd';
import './index.css';
import Course from './Course';

const { Search } = Input;

function Body() {
  return (
    <div className='body'>
      <Search
        placeholder='请输入课程名称查询'
        allowClear
        style={{ width: 300 }}
      />
      <Course />
    </div>
  );
}

export default Body;
