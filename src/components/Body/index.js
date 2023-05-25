import { Input } from 'antd';
import './index.css';

const { Search } = Input;

function Body() {
  return (
    <div className='body'>
      <Search
        placeholder='请输入课程名称查询'
        allowClear
        style={{ width: 300 }}
      />
    </div>
  );
}

export default Body;
