'use client';
import React, { useCallback, useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import Wrapper from '@/components/shared/Wrapper';
import TextButton from '@/components/shared/buttons/TextButton';
import InputSet from '@/components/shared/input';
import useInputChange from '@/hooks/input/useInputChange';
import Withdrawal from '@/components/user/Withdrawal';
import { conceptMap } from '../shared/input/inputConfig';
import useDuplicateCheck from '@/hooks/user/useDuplicateCheck';
import { useAccountUpdated } from '@/hooks/user/useAccountUpdated';
import AuthPopup from '../signup/Popup';
import useSessionData from '@/hooks/user/useSessionData';
import LoadingSpinnerWrapper from '../shared/LoadingSpinnerWrapper';

type TUserAccountEdit = {
  handleSetWithdrawal: () => void; //회원탈퇴 처리를 위한
  onClose: () => void;
  isWithdrawal: boolean;
  // isSocial: boolean;
  // user: User;
};

// 정보수정 모달에서 회원탈퇴 모달을 관리
// isWithdrawal 값에 따라 회원탈퇴모달이 발생
// handleSetWithdrawal 로 회원탈퇴 처리 되었다면
// WithdrawalComplete 페이지 렌더링
function UserAccountEdit({
  handleSetWithdrawal,
  onClose,
}: TUserAccountEdit) {
  const [isShowWithdrawal, setIsShowWithdrawal] = useState(false); //회원 탈퇴
  const { value, onChangeInputValue, setValue } = useInputChange();
  const [isSubmit, setIsSubmit] = useState(false); // 폼 submit
  const [isFormValid, setIsFormValid] = useState(false); //폼 유효성 체크
  const { isLoading, duplicatedCheck, handleDuplicate } =
    useDuplicateCheck(value.signupId); //Id 중복검사

  const {
    isLoading: updateLoading,
    handleAccountUpdate,
    isShowPopup,
    popupMsg,
    setIsShowPopup,
  } = useAccountUpdated(); //개인정보 수정 api

  const { user, isSocial } = useSessionData();

  useEffect(() => {
    if (user) {
      setValue((prevValue) => ({
        ...prevValue,
        signupId: user?.userId || '',
        name: user.name || '',
        birth: user.birth || '',
        signupPhone: user.phoneNumber || '',
      }));
    }
  }, [user, setValue]);

  // 회원탈퇴 모달 열기
  const handleShowWidthdrawl = () => setIsShowWithdrawal(true);
  // 회원정보 수정 모달 닫기
  const handleCloseWidthdrawl = () => setIsShowWithdrawal(false);
  // 결과 팝업 닫기
  const handleCloseResultPopup = () => setIsShowPopup(false);

  // session값 loadindg이면 팝업창 닫기 불가
  const handleCloseAccountModal = () => {
    if (updateLoading) return;
    onClose();
  };

  const onHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!duplicatedCheck)
      window.alert('아이디 중복검사를 확인해주세요');
    if (!isFormValid) return;
    const formData = new FormData();
    formData.append('userId', value.signupId.trim());
    formData.append('name', value.name.trim());
    formData.append('birth', value.birth.trim());
    formData.append('phoneNumber', value.signupPhone.trim());
    formData.append('accessToken', user.accessToken || '');
    formData.append('refreshToken', user.refreshToken || '');
    handleAccountUpdate(formData);
  };

  const validateForm = useCallback(() => {
    const isNameValid = conceptMap.name.doValidation(value.name);
    const isSignupPhoneValid = conceptMap.signupPhone.doValidation(
      value.signupPhone,
    );
    const isBirthValid = conceptMap.birth.doValidation(value.birth);
    if (isSocial) {
      // 소셜 로그인일 경우 생일과 전화번호만 유효성 검사
      setIsFormValid(
        isSignupPhoneValid && isBirthValid && isNameValid,
      );
    } else {
      // 일반 로그인일 경우 모든 필드 유효성 검사
      const isSignupIdValid = duplicatedCheck;
      setIsFormValid(
        isNameValid &&
          isSignupIdValid &&
          isSignupPhoneValid &&
          isBirthValid,
      );
    }
  }, [
    value.name,
    value.birth,
    value.signupPhone,
    duplicatedCheck,
    isSocial,
  ]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  return (
    <>
      {isShowWithdrawal ? (
        <Withdrawal
          handleSubmit={handleSetWithdrawal}
          onClose={handleCloseWidthdrawl}
        />
      ) : (
        <ModalWrapper onClose={handleCloseAccountModal}>
          <Wrapper padding="px-24 py-20" width="w-[590px]">
            <h3 className="h3 font-bold text-center text-primary-900 mb-8">
              정보 수정
            </h3>
            <LoadingSpinnerWrapper isLoading={updateLoading}>
              <form
                onSubmit={onHandleSubmit}
                className="flex flex-col justify-start w-[386px] h-full"
              >
                {/* 수정 성공/에러 메시지 팝업 */}
                {isShowPopup && (
                  <AuthPopup
                    error={true}
                    title={popupMsg.title}
                    errorMessage={popupMsg.msg}
                    onClose={handleCloseResultPopup}
                  />
                )}
                <InputSet className="flex flex-col gap-4">
                  {/* 소셜 회원이 아닌경우에 아이디 수정*/}
                  {!isSocial && (
                    <InputSet.DuplicateCheck
                      onChange={onChangeInputValue}
                      onClick={handleDuplicate}
                      value={value.signupId}
                      type="text"
                      concept="signupId"
                      isLoading={isLoading}
                      isSubmit={isSubmit}
                    />
                  )}
                  <InputSet.Validated
                    onChange={onChangeInputValue}
                    value={value.name}
                    type="text"
                    concept="name"
                    isSubmit={isSubmit}
                  />
                  <InputSet.Validated
                    onChange={onChangeInputValue}
                    value={value.signupPhone}
                    type="text"
                    concept="signupPhone"
                    isSubmit={isSubmit}
                  />
                  <InputSet.Validated
                    onChange={onChangeInputValue}
                    value={value.birth}
                    type="text"
                    concept="birth"
                    isSubmit={isSubmit}
                  />
                  <TextButton type="submit" className="w-full mt-8">
                    수정하기
                  </TextButton>
                </InputSet>
                <button
                  type="button"
                  className="border-none bg-grayscale-0 text-center underline mt-4 text-warning-100"
                  onClick={handleShowWidthdrawl}
                >
                  회원 탈퇴
                </button>
              </form>
            </LoadingSpinnerWrapper>
          </Wrapper>
        </ModalWrapper>
      )}
    </>
  );
}

export default UserAccountEdit;
