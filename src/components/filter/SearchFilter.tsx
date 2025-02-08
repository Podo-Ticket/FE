import React, { useState, useEffect } from "react";
import styled from "styled-components";

import SearchIconImg from "../../assets/images/admin/magnifier.png";

import SelectIcon from "../../assets/images/admin/lightgray_down_arrow.png";
import ActSelectIcon from "../../assets/images/admin/darkblue_down_arrow.png";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  group: string;
  setGroup: (value: string) => void;
  title: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ search, setSearch, department, setDepartment, group, setGroup, title}) => {
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
    setGroup("default");   
  };

  const handleGroupChange = (event) => setGroup(event.target.value);

  const isGroupDisabled = department === "사업기획팀" || department === "그로스팀" || department === "CX팀";

  return (
    <SearchFilterContainer>
      <SearchBar>
        <SearchInput
          type="text"
          className="text-sm-100"
          placeholder={title}
          value={search}
          onChange={handleSearch}
        />
        <SearchButton>
          <SearchIcon src={SearchIconImg} />
        </SearchButton>
      </SearchBar>

      <FilterSelectContainer>
        <FilterSelector>
          <FilterSelect
            value={department}
            onChange={handleDepartmentChange}
            className={department !== "default" ? "active" : ""}
          >
            <option value="default">소속</option>
            <option value="음성 1센터">음성 1센터</option>
            <option value="음성 2센터">음성 2센터</option>
            <option value="용인백암센터">용인백암센터</option>
            <option value="남양주센터">남양주센터</option>
            <option value="파주센터">파주센터</option>
            <option value="사업기획팀">사업기획팀</option>
            <option value="그로스팀">그로스팀</option>
            <option value="CX팀">CX팀</option>
          </FilterSelect>
          <FilterFilterIcon1
            src={department !== "default" ? ActSelectIcon : SelectIcon}
          />
        </FilterSelector>

        {department === "default" ? undefined : (
          <FilterSelector>
            <FilterSelect
              value={isGroupDisabled ? "1" : group}
              onChange={handleGroupChange}
              className={group !== "default" ? "active" : ""}
              disabled={isGroupDisabled}
            >
              <option value="default">그룹</option>
              <option value="1">그룹 1</option>
              <option value="2">그룹 2</option>
            </FilterSelect>
            <FilterFilterIcon2
              src={group !== "default" ? ActSelectIcon : SelectIcon}
            />
          </FilterSelector>
        )}
      </FilterSelectContainer>
    </SearchFilterContainer>
  );
};

export default SearchFilter;

const SearchFilterContainer = styled.div`
  display: flex;
  flex-direction: column;

  background: var(--gray-0);
  border-radius: 0 0 15px 15px;

  padding: 15px;

  position: sticky;
  top: 71px;
  left: 0;
  right: 0;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  
  border-radius: 10px;
  background: var(--gray-80);

  margin-bottom: 16px;
  padding: 6px 15px;
  
  font-size: 15px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex-grow: 1;

  background: var(--gray-80);

  padding: 11px 15px;
  padding-left: 0px;

  &::placeholder {
    color: var(--gray-40);
  }
`;

const SearchButton = styled.button`
  border: none;
  background: var(--gray-80);
`;

const SearchIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const FilterSelectContainer = styled.div`
  display: flex;
  position: relative;

  gap: 5px;
`;

const FilterSelector = styled.div`
position: relative;
`;

const FilterSelect = styled.select`
  appearance: none;
  border-radius: 30px;
  border: none;
  background: var(--gray-20);

  padding: 5px 14px;
  padding-right: 28px;

  color: ${({ value }) =>
    value === "default" ? "var(--gray-100)" : "var(--gray-10)"};

  &.active {
    background-color: var(--gray-70);
    color: var(--sub-20);
  }

  &:disabled {
    color: var(--sub-20);
    background-color: var(--gray-70);
}
`;

const FilterFilterIcon1 = styled.img`
position: absolute;
left: 80%;
top: 40%;

  width: 11px;
  height: 7px;
`;

const FilterFilterIcon2 = styled.img`
position: absolute;
left: 72%;
top: 40%;

  width: 11px;
  height: 7px;
`;