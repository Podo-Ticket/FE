import React from "react";
import styled from "styled-components";

import magnifier from '../../assets/images/admin/magnifier.png'

import { DateUtil } from '../../utils/DateUtil';

// SearchBar Props 타입 정의
interface SearchFilterBarProps {
  search: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchButtonClick: () => void;
  filter: string;
  totalCount: number;
  unacceptCount: number;
  acceptCount: number;
  handleFilterClick: (filterType: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  handleSearch,
  handleSearchButtonClick,
  filter,
  totalCount,
  unacceptCount,
  acceptCount,
  handleFilterClick,
}) => {
  return (
    <ViewContainer>
      {/* 검색 바 */}
      <SearchBar>
        <SearchInput
          className='Podo-Ticket-Body-B5'
          type="text"
          placeholder="이름과 연락처로 검색 가능합니다."
          value={search}
          onChange={handleSearch}
        />
        <SearchButton onClick={handleSearchButtonClick}>
          <SearchIcon src={magnifier} />
        </SearchButton>
      </SearchBar>

      {/* 필터 버튼 */}
      <FilterButtonsContainer>
        <FilterButtons>
          <FilterButton
            isActive={filter === "전체"}
            onClick={() => handleFilterClick("전체")}
          >
            전체 {totalCount}건
          </FilterButton>
          <FilterButton
            isActive={filter === "미 수락"}
            onClick={() => handleFilterClick("미 수락")}
          >
            미 수락 {unacceptCount}건
          </FilterButton>
          <FilterButton
            isActive={filter === "수락 완료"}
            onClick={() => handleFilterClick("수락 완료")}
          >
            수락 {acceptCount}건
          </FilterButton>
        </FilterButtons>
      </FilterButtonsContainer>
    </ViewContainer>
  );
};

export default SearchFilterBar;

// 컨테이너 스타일
const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;

  background: var(--background-1);
  border: 0.5px solid var(--grey-4);

  padding: 15px;
`;

// 검색 바 스타일
const SearchBar = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex-grow: 1;

  border: 0.5px solid var(--grey-4);
  border-radius: 10px;
  background: var(--ect-white);

  padding: 5px 15px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-size: 14px;
    font-weight: 400;
    line-height: 28px;
    color: var(--grey-4); 
  }
`;

const SearchButton = styled.button`
  position: absolute;
  left: 80%;
  display: flex;
  align-items: center;

  border: none;
  background: transparent;

  margin-left: 10px;
  padding: 10px;

  cursor: pointer;
`;

const SearchIcon = styled.img`
width: 15px;
height: 15px;
`;

// 필터 버튼 컨테이너 스타일
const FilterButtonsContainer = styled.div`
  display: flex;

  margin-top: 10px;
`;

// 필터 버튼 그룹 스타일
const FilterButtons = styled.div`
  display: flex;

  gap: 5px;
`;

// 필터 버튼 스타일
interface FilterButtonProps {
  isActive?: boolean;
}

const FilterButton = styled.button.attrs({ className: 'Podo-Ticket-Body-B9' }) <FilterButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid ${({ isActive }) => (isActive ? "var(--purple-7)" : "var(--grey-3)")};
  border-radius: 30px;
  background-color: ${({ isActive }) => (isActive ? "var(--lightpurple-2)" : "var(--ect-white)")};
  
  padding: 4px 14px;

  color: ${({ isActive }) => (isActive ? "var(--purple-4)" : "var(--grey-5)")};

  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:focus {
    outline: none;
  }
`;