import './index.css';

function Header() {
  return (
    <div className='footer'>
      <div>Copyright © {new Date().getFullYear()} by: 公众号-课程减减</div>
      <div
        className='beian'
        onClick={() => window.open('https://beian.miit.gov.cn/', '_blank')}
      >
        沪ICP备2021019937号-2
      </div>
    </div>
  );
}

export default Header;
