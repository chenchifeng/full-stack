import { Input } from 'antd';
import './index.css';
import Course from './Course';
import { useState } from 'react';

function Body() {
  const { Search } = Input;

  const [searchKey, setSearchKey] = useState('');

  const onSearch = (key) => {
    setSearchKey(key);
  };

  return (
    <div className='body'>
      <Search
        placeholder='请输入课程名称查询'
        allowClear
        style={{ width: 300 }}
        onSearch={onSearch}
      />
      <Course searchKey={searchKey} />
    </div>
  );
}

export default Body;
