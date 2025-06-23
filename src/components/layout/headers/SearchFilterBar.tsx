import React from 'react';
import styled from 'styled-components';

import magnifier from '@assets/icons/ic_magnify.svg';
import closeIcon from '@assets/icons/ic_delete.svg';

interface SearchFilterBarProps {
  search: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchButtonClick: () => void;
  handleClearSearch: () => void;
  filter: string;
  totalCount: number;
  unacceptCount: number;
  acceptCount: number;
  handleFilterClick: (filterType: string) => void;
  isReserved?: boolean;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  handleSearch,
  handleSearchButtonClick,
  handleClearSearch,
  filter,
  totalCount,
  unacceptCount,
  acceptCount,
  handleFilterClick,
  isReserved = false,
}) => {
  return (
    <ViewContainer>
      <SearchBar>
        <SearchButton onClick={search ? handleClearSearch : handleSearchButtonClick}>
          <SearchIcon src={search ? closeIcon : magnifier} />
        </SearchButton>
        <SearchInput
          className='Podo-Ticket-Body-B5'
          type='text'
          placeholder='이름과 연락처로 검색 가능합니다.'
          value={search}
          onChange={handleSearch}
        />
      </SearchBar>

      {/* 필터 버튼 */}
      <FilterButtonsContainer>
        <FilterButtons>
          <FilterButton isActive={filter === '전체'} onClick={() => handleFilterClick('전체')}>
            전체 {totalCount}건
          </FilterButton>
          <FilterButton
            isActive={filter === '미 수락'}
            onClick={() => handleFilterClick('미 수락')}
          >
            {isReserved ? '미 발권' : '미 수락'} {unacceptCount}건
          </FilterButton>
          <FilterButton
            isActive={filter === '수락 완료'}
            onClick={() => handleFilterClick('수락 완료')}
          >
            {isReserved ? '발권 완료' : '수락'} {acceptCount}건
          </FilterButton>
        </FilterButtons>
      </FilterButtonsContainer>
    </ViewContainer>
  );
};

export default SearchFilterBar;

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;

  background: var(--ect-white);
  border: none;

  padding: 15px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: stretch;

  border-bottom: 0.5px solid var(--grey-5);

  width: 100%;
`;

const SearchInput = styled.input`
  flex-grow: 1;

  border: none;
  background: var(--ect-white);

  padding: 5px 10px;
  height: 100%;

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

const SearchButton = styled.div`
  display: flex;
  align-items: center;

  border: none;

  padding: 0 5px;
  height: 100%;

  cursor: pointer;
`;

const SearchIcon = styled.img`
  width: 100%;
  height: 100%;
`;

const FilterButtonsContainer = styled.div`
  display: flex;

  margin-top: 10px;
`;

const FilterButtons = styled.div`
  display: flex;

  gap: 5px;
`;

// 필터 버튼 스타일
interface FilterButtonProps {
  isActive?: boolean;
}

const FilterButton = styled.button.attrs({
  className: 'Podo-Ticket-Body-B9',
})<FilterButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid ${({isActive}) => (isActive ? 'var(--purple-7)' : 'var(--grey-3)')};
  border-radius: 30px;
  background-color: ${({isActive}) => (isActive ? 'var(--lightpurple-2)' : 'var(--ect-white)')};

  padding: 4px 14px;

  color: ${({isActive}) => (isActive ? 'var(--purple-4)' : 'var(--grey-5)')};

  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:focus {
    outline: none;
  }
`;
