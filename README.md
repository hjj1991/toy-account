# Welcome  뜨끔한 가계부 🤑

> 뜨끔한 가계부 / 개인 토이프로젝트

🏠 [사이트 바로가기](https://cash.sundry.ninja)

## 🔨 Tech Stacks

<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black">

<Br/>

## 📄Description
```sh
뜨끔한 가계부는 재테크가 중요한 시대의 다양한 금융정보를 사용자에게 제공 하며, 가계부 작성을 통한 소비습관 증진에 도움을 주기위한 사이트 제작을 목표로 하고 있으며 끊임없이 업데이트 할 예정입니다.
```

## 🔍서비스 기능
|날짜|기능|설명|
|----|---|---|
|N/A|반응형 지원| 각 디바이스에 맞게 UI 자동 크기 전환 |
|N/A|로그인/회원가입| 자체, KAKAO, NAVER 회원가입 및 로그인 기능 지원
|N/A|예금 조회| 시중의 은행, 저축은행에서 판매중인 예금목록 조회 구현
|N/A|적금 조회| 시중의 은행, 저축은행에서 판매중인 적금목록 조회 구현
|N/A|카드 CRUD| 가계부 작성에 사용할 자신이 소유중인 카드의 조회/등록/수정/삭제 구현
|N/A|카테고리 CRUD| 지출 내역 작성시 사용할 카테고리의 조회/등록/수정/삭제 구현
|N/A|소비 입출 CRUD| 날짜, 금액, 소비, 지출 상세 내역을 조회/등록/수정/삭제 구현
|N/A|가계부 CRUD| 용도에 따라 개인의 다양한 가계부 조회/등록/수정/삭제 구현
|N/A|마이페이지| 사용자 정보 수정 및 소셜 계정 연동 프로필 이미지 크롭 기능

<br/>

> ### <span style="color:green">**TODO** 추가할 기능</span>

|날짜|기능|설명|
|----|---|---|
|미정|공유 가계부| 사용자간의 초대를 통한 가계부 공유작성
|미정|공유 가계부 권한 적용| 공유 가계부내의 권한을 추가하여 권한 별 기능 접근 추가
|미정|가계부 초대 및 알림 기능| 로그인 중인 사용자의 경우 Socket통신을 통하여 실시간으로 가계부 초대/수락/거절 상태를 사용자에게 알림을 주도록 구현

## 🔍Overview

- Main 화면 / 회원가입 / 로그인
  - 적금 / 예금 우대 이율 순으로 10개씩 보여줌.

![Main_view](info/main_mobile.gif)

- 마이페이지
  - 크롭 라이브러리를 이용하여 프로필 사진 꾸미기 기능

![profile](info/profile_image.gif)

- 카드 목록화면
  - 개인 사용자의 카드 조회/추가/수정/삭제 기능 

![card_CRUD](info/card_CRUD.gif)


- 가계부 목록화면
  - 개인 사용자의 가게부 추가/수정/삭제 기능

![accountbook_add](info/add_accountbook.gif)

- 가계부 상세화면
  - 가계부 항목 추가
  - 지출 목록 검색 필터링

![accountbookDetail_add](info/add_raw.gif)
![search_raw](info/search_raw.gif)

- 카테고리 화면
  - 카테고리 항목 추가
  - 하위 카테고리 추가

![category_Add](info/add_category.gif)
![category_detail_Add](info/add_categorydetail.gif)


- 예금상품 상세 화면
  - 예금 상품 조회 및 필터링, 정렬 검색
  
![deposit_search](info/search_deposit.gif)
![deposit_web](info/deposit_web.gif)


- 적금상품 상세 화면
  - 적금 상품 조회 및 필터링, 정렬 검색
  - PC화면의 경우 상세 조회기능 지원

![saving_seach](info/search_saving.gif)
![saving_web](info/saving_web.gif)


## 🏃 Steps to run
```sh
$ npm install
$ npm start
```