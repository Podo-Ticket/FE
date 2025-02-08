import React from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";

import Home from "../../assets/images/gray_star.png";
import ActHome from "../../assets/images/orange_star.png";
import Quest from "../../assets/images/gray_task_add.png";
import ActQuest from "../../assets/images/orange_task_add.png";
import Board from "../../assets/images/gray_pin_paper.png";
import ActBoard from "../../assets/images/orange_pin_paper.png";
import Mypage from "../../assets/images/gray_person_circle.png";
import ActMypage from "../../assets/images/orange_person_circle.png";

import Setting from "../../assets/images/admin/gray_setting.png"
import ActSetting from "../../assets/images/admin/orange_setting.png"

interface FooterNavProps {
    isAdmin?: boolean // 어드민 계정 여부
}

const FotterNav: React.FC<FooterNavProps> = ({ isAdmin = false }) => {
  const location = useLocation(); // 현재 경로를 가져옴

  return (
    <Nav className="caption-md-200">
      {isAdmin ?
        <>
          <NavItem className={location.pathname.startsWith("/member") ? "active" : ""}>
            <NavLink to="/member">
              <IconQuest src={location.pathname.startsWith("/member") ? ActMypage : Mypage} />
              <p>구성원</p>
            </NavLink>
          </NavItem>
          <NavItem
            className={location.pathname.startsWith("/admin-board") ? "active" : ""}
          >
            <NavLink to="/admin-board">
              <IconBoard
                src={location.pathname.startsWith("/admin-board") ? ActBoard : Board}
              />
              <p>게시글</p>
            </NavLink>
          </NavItem>
          <NavItem className={location.pathname.startsWith("/setting") ? "active" : ""}>
            <NavLink to="/setting">
              <IconMypage
                src={location.pathname.startsWith("/setting") ? ActSetting : Setting}
              />
              <p>설정</p>
            </NavLink>
          </NavItem>
        </>
        :
        <>
          <NavItem className={location.pathname.startsWith("/home") ? "active" : ""}>
            <NavLink to="/home">
              <IconHome
                src={location.pathname.startsWith("/home") ? ActHome : Home}
              />
              <p>홈</p>
            </NavLink>
          </NavItem>
          <NavItem className={location.pathname.startsWith("/quest") ? "active" : ""}>
            <NavLink to="/quest">
              <IconQuest src={location.pathname.startsWith("/quest") ? ActQuest : Quest} />
              <p>퀘스트</p>
            </NavLink>
          </NavItem>
          <NavItem
            className={location.pathname.startsWith("/board") ? "active" : ""}
          >
            <NavLink to="/board">
              <IconBoard
                src={location.pathname.startsWith("/board") ? ActBoard : Board}
              />
              <p>게시판</p>
            </NavLink>
          </NavItem>
          <NavItem className={location.pathname.startsWith("/mypage") ? "active" : ""}>
            <NavLink to="/mypage">
              <IconMypage
                src={location.pathname.startsWith("/mypage") ? ActMypage : Mypage}
              />
              <p>나의 정보</p>
            </NavLink>
          </NavItem>
        </>
      }

    </Nav>
  );
};

export default FotterNav;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  height: 100px;
  background: var(--gray-0);
  border: none;
  border-top: 1px solid #666;
  box-shadow: 0px 0px 9px 6px rgba(0, 0, 0, 0.03);
  border-radius: 20px 20px 0px 0px;

  z-index: 1000;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 80%;
  height: 100%;

  color: var(--gray-20);
  text-align: center;

  &.active {
    color: var(--orange-70); /* 활성화된 텍스트 색상 */
  }

  user-select: none; /* 텍스트 선택 방지 */
  -webkit-user-select: none; /* Safari에서 드래그 방지 */
  -moz-user-select: none; /* Firefox에서 드래그 방지 */
  -ms-user-select: none;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  width: inherit;
  height: inherit;

  & > p {
    margin: 0;
    padding: 0;
  }
  p {
    margin-bottom: 32px;
  }
`;

const IconHome = styled.img`
  width: 24px;
  height: 24px;
  margin-top: 19px;
  margin-bottom: 5px;
`;

const IconQuest = styled.img`
  width: 24px;
  height: 24px;
  margin-top: 19px;
  margin-bottom: 1px;
`;

const IconBoard = styled.img`
  width: 24px;
  height: 22px;
  margin-top: 21px;
  margin-bottom: 5px;
`;

const IconMypage = styled.img`
  width: 22px;
  height: 22px;
  margin-top: 19px;
  margin-bottom: 5px;
`;