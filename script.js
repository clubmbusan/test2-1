document.addEventListener('DOMContentLoaded', () => {
    // ✅ DOM 요소 참조 (모든 요소 포함 13개)
    const inheritanceType = document.getElementById('inheritanceType');
    const personalSection = document.getElementById('personalSection');
    const groupSection = document.getElementById('groupSection');
    const businessPersonalSection = document.getElementById('businessPersonalSection');
    const otherAssetContainer = document.getElementById('otherAssetContainer'); 

    // ✅ 새로운 법정 상속 관련 요소 추가
    const legalInheritanceSection = document.getElementById('legalInheritanceSection');
    const legalHeirContainer = document.getElementById('legalHeirContainer');
    const addLegalHeirButton = document.getElementById('addLegalHeirButton');

    const otherAssetType = document.getElementById('otherAssetType'); 
    const assetType = document.getElementById('assetType');
    const addAssetButton = document.getElementById('addAssetButton');
    const assetContainer = document.getElementById('assetContainer');
    const addHeirButton = document.getElementById('addHeirButton');
    const businessGroupHeirContainer = document.getElementById('businessGroupHeirContainer');
    const calculateButton = document.getElementById('calculateButton');
    const result = document.getElementById('result');

    // ✅ 기타 상속 관련 필드
    const dwellingSection = document.getElementById('dwellingSection');
    const farmingSection = document.getElementById('farmingSection');
    const factorySection = document.getElementById('factorySection');
    const farmingYears = document.getElementById('farmingYears'); // 영농 연수
    const factoryYears = document.getElementById('factoryYears'); // 공장 연수

    // ✅ 재산 입력 필드
    const cashAmount = document.getElementById('cashAmount');
    const realEstateValue = document.getElementById('realEstateValue');
    const othersValue = document.getElementById('othersValue')
  
    // ✅ 섹션 초기화 함수
    function resetSections() {
        personalSection.style.display = 'none';
        groupSection.style.display = 'none';
        legalInheritanceSection.style.display = 'none';  // ✅ 법정 상속 섹션 추가
        businessPersonalSection.style.display = 'none';
        dwellingSection.style.display = 'none';
        farmingSection.style.display = 'none';
        factorySection.style.display = 'none';
        otherAssetContainer.style.display = 'none';
    }

    // ✅ 초기 로딩 시 개인 상속을 기본값으로 설정
    function initializeDefaultView() {
        resetSections();
        personalSection.style.display = 'block';
    }

   // ✅ 상속 유형 변경 이벤트 리스너 (기타 상속 시 동거주택이 기본 선택되도록 수정)
    inheritanceType.addEventListener('change', () => {
        resetSections();
        
        if (inheritanceType.value === 'other') {
            otherAssetContainer.style.display = 'block';  
            otherAssetType.value = 'dwelling'; // ✅ 동거주택 기본 선택
            dwellingSection.style.display = 'block'; // ✅ 동거주택 안내 문구 표시
            farmingSection.style.display = 'none';
            factorySection.style.display = 'none';

            assetType.value = 'realEstate';  // 부동산으로 고정
            assetType.disabled = true;  // 재산 유형 선택 비활성화

            // ✅ 부동산 입력 필드만 표시
            cashAmount.style.display = 'none';
            realEstateValue.style.display = 'block';
            othersValue.style.display = 'none';

            // ✅ 부동산 필드명 변경 ('기타 금액' → '평가액')
            realEstateValue.setAttribute("placeholder", "평가액 (원)");
        } else {
            otherAssetContainer.style.display = 'none';  
            assetType.disabled = false;  // 재산 유형 다시 활성화

            // ✅ 기타 상속 -> 다른 유형 변경 시 연수 입력 필드 초기화
            if (farmingYears) farmingYears.value = "";
            if (factoryYears) factoryYears.value = "";
        }

        switch (inheritanceType.value) {
            case 'personal': 
                personalSection.style.display = 'block'; 
                break;
            case 'group': 
                groupSection.style.display = 'block'; 
                break;
            case 'legal':  
                legalInheritanceSection.style.display = 'block'; // ✅ 법정 상속 표시
                applyLegalShares(); // ✅ 법정 상속 자동 계산 적용
                break;
            case 'businessPersonal': 
                businessPersonalSection.style.display = 'block'; 
                break;
        }
    });

    // ✅ 기타 상속 유형(동거주택, 영농, 공장) 선택 시 해당 섹션 표시
    otherAssetType.addEventListener('change', () => {
        dwellingSection.style.display = 'none';
        farmingSection.style.display = 'none';
        factorySection.style.display = 'none';

        switch (otherAssetType.value) {
            case 'dwelling':
                dwellingSection.style.display = 'block';
                break;
            case 'farming':
                farmingSection.style.display = 'block';
                if (farmingYears) farmingYears.value = 10; // 자동 10년 이상 입력
                break;
            case 'factory':
                factorySection.style.display = 'block';
                if (factoryYears) factoryYears.value = 10; // 자동 10년 이상 입력
                break;
        }
    });

    // ✅ 개인 상속: 미성년 자녀 나이 입력 필드 추가 (수정된 코드)
    const minorChildAgeContainer = document.getElementById('minorChildAgeContainer');
    const relationshipSelect = document.querySelector("#relationshipPersonal"); // ✅ 올바른 요소 선택

    if (relationshipSelect && minorChildAgeContainer) {
        relationshipSelect.addEventListener('change', function () {
            minorChildAgeContainer.style.display = this.value === 'minorChild' ? 'block' : 'none';
        });
    }

 // ✅ 전체 상속 (협의 상속, 법정 상속): 미성년 자녀 나이 입력 필드 추가 (중복 제거)
document.addEventListener("change", function (event) {
    if (event.target.classList.contains("relationship")) {
        const heirEntry = event.target.closest(".heir-entry");
        const minorChildAgeField = heirEntry?.querySelector(".minorChildAgeField");

        if (minorChildAgeField) {
            minorChildAgeField.style.display = event.target.value === "minorChild" ? "block" : "none";
        }
    }
});
  
    // 자산 유형 변경 처리
    function handleAssetTypeChange(assetTypeSelect) {
    const assetEntry = assetTypeSelect.closest('.asset-entry');
    if (!assetEntry) {
        console.error('assetTypeSelect의 상위 .asset-entry 요소를 찾을 수 없습니다.');
        return; // 더 이상 진행하지 않음
    }

    const assetFields = assetEntry.querySelector('.assetFields');
    const fields = {
        cashField: assetFields.querySelector('.cashField'),
        realEstateField: assetFields.querySelector('.realEstateField'),
        stockQuantityField: assetFields.querySelector('.stockQuantityField'),
        stockPriceField: assetFields.querySelector('.stockPriceField'),
        stockTotalField: assetFields.querySelector('.stockTotalField'),
        othersField: assetFields.querySelector('.othersField'),
    };

    // 모든 필드 숨기기 (기존 코드는 삭제됨)
    Object.values(fields).forEach(field => {
        if (field) field.style.display = 'none';
    });

    // 선택된 유형에 따라 표시
    switch (assetTypeSelect.value) {
        case 'cash':
            fields.cashField.style.display = 'block';
            break;
        case 'realEstate':
            fields.realEstateField.style.display = 'block';
            break;
        case 'stock':
            fields.stockQuantityField.style.display = 'block';
            fields.stockPriceField.style.display = 'block';
            fields.stockTotalField.style.display = 'block';
            break;
        case 'others':
            fields.othersField.style.display = 'block';
            break;
        default:
            console.error('알 수 없는 자산 유형입니다:', assetTypeSelect.value);
            break;
    }
}

    // 모든 assetType에 이벤트 리스너 추가
document.querySelectorAll('.assetType').forEach(select => {
    select.addEventListener('change', () => handleAssetTypeChange(select));
});

    // 초기화 호출
initializeDefaultView();
    
// ✅ "다시 하기" 버튼 이벤트 리스너 (추가된 필드 숨기기 + 입력값 초기화)
document.querySelectorAll('.removeAssetButton').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        console.log("🔄 '다시 하기' 버튼 클릭됨! 추가된 입력 필드 닫기 & 입력값 초기화 실행!");

        // ✅ 선택된 '상속 유형'과 '재산 유형' 값을 저장
        const selectedInheritanceType = document.querySelector('#inheritanceType')?.value; // 상속 유형
        const selectedAssetType = document.querySelector('.assetType')?.value; // 재산 유형

        // ✅ 추가된 "재산 항목(.asset-entry)" 숨기기 (첫 번째 항목 제외)
        document.querySelectorAll('#assetContainer .asset-entry').forEach((asset, index) => {
            if (index !== 0) {
                asset.style.display = 'none'; // 추가된 입력 필드 숨기기
            }
        });

        // ✅ 추가된 "상속인 항목(.heir-entry)" 숨기기 (첫 번째 항목 제외)
        document.querySelectorAll('#heirContainer .heir-entry').forEach((heir, index) => {
            if (index !== 0) {
                heir.style.display = 'none'; // 추가된 입력 필드 숨기기
            }
        });

        // ✅ 모든 입력 필드 초기화 (숫자 입력 필드만)
        document.querySelectorAll('input').forEach(input => {
            input.value = ''; // 🔄 입력 필드 초기화
        });

        // ✅ 결과 영역 초기화
        const resultArea = document.getElementById('result');
        if (resultArea) {
            resultArea.innerHTML = ''; // 🔄 결과창 초기화
        }

        // ✅ 기존에 기본적으로 열려 있는 관계 입력 창(`personalSection`, `groupSection` 등)은 유지
        document.querySelectorAll('.section').forEach(section => {
            if (!section.classList.contains('active')) {
                section.style.display = 'none'; // 추가된 창만 닫음
            }
        });

        // ✅ 유지해야 할 '상속 유형', '재산 유형', '기본 상속인 입력 필드' 설정
        if (selectedInheritanceType) {
            document.querySelector('#inheritanceType').value = selectedInheritanceType;
        }
        if (selectedAssetType) {
            document.querySelector('.assetType').value = selectedAssetType;
        }

        // ✅ 기본 상속인 입력 필드는 유지 (첫 번째 항목은 다시 보이게 설정)
        document.querySelectorAll('#heirContainer .heir-entry').forEach((heir, index) => {
            if (index === 0) {
                heir.style.display = 'block'; // 기본 필드는 유지
            }
        });

        console.log("✅ 추가된 입력 필드 닫기 완료! (기본 상속인 입력 필드는 유지됨)");
    });
});
    
// 초기 주식 입력 필드에 콤마 이벤트 등록 (초기 필드)
const initialStockPriceField = document.querySelector('.stockPriceField');
if (initialStockPriceField) {
    addCommaFormatting(initialStockPriceField); // 초기 필드 이벤트 등록
}

   // ✅ 모든 상속 비용 입력 필드에 자동으로 콤마 추가
document.querySelectorAll('.inheritanceCostField').forEach((input) => {
    input.addEventListener('input', function (event) {
        let value = event.target.value.replace(/,/g, ''); // 기존 콤마 제거
        if (value !== '') { // 빈 값이 아닐 경우에만 변환
            value = parseFloat(value).toLocaleString(); // 숫자로 변환 후 콤마 추가
        }
        event.target.value = value; // 입력 필드에 반영
    });
});

     // 재산 추가 버튼 클릭 이벤트
document.getElementById('addAssetButton').addEventListener('click', () => {
    createAssetEntry();

    // 새롭게 추가된 .assetValue 필드에 콤마 이벤트 등록
    const newAssetValues = document.querySelectorAll('.asset-entry:last-child .assetValue');
    newAssetValues.forEach(addCommaFormatting);

    // 새롭게 추가된 .assetType 필드에 이벤트 등록
    const newAssetTypeSelect = document.querySelector('.asset-entry:last-child .assetType');
    if (newAssetTypeSelect) {
        newAssetTypeSelect.addEventListener('change', () => handleAssetTypeChange(newAssetTypeSelect));
    }
});

    // 재산 항목 생성
function createAssetEntry() {
    const newAsset = document.createElement('div');
    newAsset.className = 'asset-entry';
    newAsset.innerHTML = `
        <label>재산 유형:</label>
        <select class="assetType">
            <option value="cash">현금</option>
            <option value="realEstate">부동산</option>
            <option value="stock">주식</option>
            <option value="others">기타</option>
        </select>
        <div class="assetFields">
            <input type="text" class="cashField assetValue" placeholder="금액 (원)" style="display: block;">
            <input type="text" class="realEstateField assetValue" placeholder="평가액 (원)" style="display: none;">
            <input type="number" class="stockQuantityField" placeholder="주식 수량" style="display: none;">
            <input type="text" class="stockPriceField" placeholder="주당 가격 (원)" style="display: none;">
            <input type="text" class="stockTotalField assetValue" placeholder="금액 (원)" style="display: none;" readonly>
            <input type="text" class="othersField assetValue" placeholder="금액 (원)" style="display: none;">
        </div>
    `;

    // 새롭게 생성된 항목을 DOM에 추가
    assetContainer.appendChild(newAsset);

     // 자산 유형 변경 이벤트 리스너 등록
    const assetTypeSelect = newAsset.querySelector('.assetType');
    assetTypeSelect.addEventListener('change', () => handleAssetTypeChange(assetTypeSelect));
}
    
 // 숫자에 콤마를 추가하는 함수
function formatNumberWithCommas(value) {
    return parseInt(value.replace(/[^0-9]/g, '') || '0', 10).toLocaleString();
}

// 입력 필드에 콤마 추가 이벤트 등록
function addCommaFormatting(inputField) {
    inputField.addEventListener('input', () => {
        const numericValue = inputField.value.replace(/,/g, ''); // 콤마 제거
        if (!isNaN(numericValue)) {
            inputField.value = formatNumberWithCommas(numericValue); // 콤마 추가
        }
    });
} 

// 주식 총 금액 계산
document.addEventListener('input', () => {
    const stockQuantity = document.getElementById('stockQuantity');
    const stockPrice = document.getElementById('stockPrice');
    const stockTotal = document.getElementById('stockTotal');

    if (stockQuantity && stockPrice && stockTotal) {
        const quantity = parseInt(stockQuantity.value.replace(/[^0-9]/g, '') || '0', 10);
        const price = parseInt(stockPrice.value.replace(/[^0-9]/g, '') || '0', 10);
        stockTotal.value = (quantity * price).toLocaleString(); // 총 금액 계산 및 콤마 추가
    }

    const mixedStockQuantity = document.getElementById('mixedStockQuantity');
    const mixedStockPrice = document.getElementById('mixedStockPrice');
    const mixedTotalAmount = document.getElementById('mixedTotalAmount');

    if (mixedStockQuantity && mixedStockPrice && mixedTotalAmount) {
        const quantity = parseInt(mixedStockQuantity.value.replace(/[^0-9]/g, '') || '0', 10);
        const price = parseInt(mixedStockPrice.value.replace(/[^0-9]/g, '') || '0', 10);
        const total = quantity * price;
        const cash = parseInt(document.getElementById('mixedCashAmount').value.replace(/[^0-9]/g, '') || '0', 10);
        const realEstate = parseInt(document.getElementById('mixedRealEstateValue').value.replace(/[^0-9]/g, '') || '0', 10);

        mixedTotalAmount.value = (total + cash + realEstate).toLocaleString(); // 총 금액 계산 및 콤마 추가
    }
});
    
    // 계산 시 숫자만 추출
function getNumericValue(field) {
    return parseFloat(field.value.replace(/[^0-9]/g, '')) || 0; // 숫자로 변환 (기본값 0)
}
    
// 상속 비율 입력값 검증 함수
    function validateSharePercentage() {
        const percentageFields = Array.from(document.querySelectorAll('.sharePercentageField'));
        const totalPercentage = percentageFields.reduce((sum, field) => {
            const value = parseFloat(field.value) || 0;
            return sum + value;
        }, 0);

        if (totalPercentage > 100) {
            alert("상속 비율의 합이 100%를 초과할 수 없습니다.");
            return false;
        }

        return true;
    }

      // 상속인 추가 버튼 이벤트
addHeirButton.addEventListener('click', () => {
    const newHeirEntry = document.createElement('div');
    newHeirEntry.className = 'heir-entry';
    newHeirEntry.innerHTML = `
        <input type="text" placeholder="이름" class="heirName">
        <select class="relationship">
            <option value="spouse">배우자</option>
            <option value="adultChild">자녀(성년)</option>
            <option value="minorChild">자녀(미성년)</option>
            <option value="parent">부모</option>
            <option value="sibling">형제자매</option>
            <option value="other">기타</option>
        </select>
        <select class="parentAgeField" style="display: none;">
            <option value="59">60세 미만</option>
            <option value="60">60세 이상</option>
        </select>
        <input type="number" class="minorChildAgeField" style="display: none;" min="0" max="18" placeholder="나이 입력">
        <input type="number" class="sharePercentageField" placeholder="상속 비율(%)">
    `;

  // 새로 추가된 상속인 입력 필드에 이벤트 등록
const relationshipSelect = newHeirEntry.querySelector('.relationship');
const minorChildAgeField = newHeirEntry.querySelector(".minorChildAgeField");

relationshipSelect.addEventListener("change", function () {
    const parentAgeField = newHeirEntry.querySelector(".parentAgeField");

    // 부모 선택 시 연령 필드 표시
    parentAgeField.style.display = this.value === "parent" ? "inline-block" : "none";

    // 미성년 자녀 선택 시 나이 입력 필드 표시
    minorChildAgeField.style.display = this.value === "minorChild" ? "block" : "none";

    // 🔥 미성년자 선택 시 나이 입력을 강제 (기본값 없음, 반드시 입력해야 함)
    if (this.value === "minorChild") {
        minorChildAgeField.value = ""; // 기본값 제거
        minorChildAgeField.setAttribute("placeholder", "나이를 입력하세요");
    }
});

// 상속세 계산 시, 미성년자 나이 입력 여부 확인
function calculateRelationshipExemption(relationship, age) {
    if (relationship === "minorChild") {
        if (!age || isNaN(age) || age === "") {
            console.error("❌ 미성년 자녀 나이를 입력해야 합니다!");
            alert("미성년 자녀의 나이를 입력하세요."); // 사용자에게 알림
            return 0; // 계산 방지
        }
        return 10000000 * (19 - age);
    }
}

    // 새로 추가된 상속 비율 필드 이벤트 등록
    const sharePercentageField = newHeirEntry.querySelector('.sharePercentageField');
    sharePercentageField.addEventListener('input', () => {
        const value = parseFloat(sharePercentageField.value) || 0;

        // 비율 검증: 범위 제한 (0~100)
        if (value < 0 || value > 100) {
            alert('상속 비율은 0%에서 100% 사이여야 합니다.');
            sharePercentageField.value = ''; // 잘못된 입력 초기화
            return;
        }

        // 전체 합 검증
        if (!validateSharePercentage()) {
            sharePercentageField.value = ''; // 잘못된 입력 초기화
        }
    });

    heirContainer.appendChild(newHeirEntry);
});

// 기존 상속 비율 필드 이벤트 등록 (최초 로딩 시 적용)
document.querySelectorAll('.sharePercentageField').forEach((field) => {
    field.addEventListener('input', () => {
        const value = parseFloat(field.value) || 0;

        // 비율 검증: 범위 제한 (0~100)
        if (value < 0 || value > 100) {
            alert('상속 비율은 0%에서 100% 사이여야 합니다.');
            field.value = ''; // 잘못된 입력 초기화
            return;
        }

        // 전체 합 검증
        if (!validateSharePercentage()) {
            field.value = ''; // 잘못된 입력 초기화
        }
    });
});

     // ✅ 법정 상속: 상속인 추가 기능 (협의 상속과 동일)
    addLegalHeirButton.addEventListener('click', () => {
        const newHeir = document.createElement('div');
        newHeir.classList.add('heir-entry');
        newHeir.innerHTML = `
            <input type="text" placeholder="이름" class="heirName">
            <select class="relationship">
                <option value="spouse">배우자</option>
                <option value="adultChild">성년 자녀</option>
                <option value="minorChild">미성년 자녀</option>
                <option value="parent">부모</option>
                <option value="sibling">형제자매</option>
                <option value="other">기타</option>
            </select>
            <!-- 미성년 자녀 나이 입력 필드 -->
            <input type="number" class="minorChildAgeField" style="display: none;" min="0" max="18" placeholder="나이 입력">
        `;
        legalHeirContainer.appendChild(newHeir);
        applyLegalShares(); // ✅ 자동으로 법정 상속 비율 적용
    });
    
// 재산 유형에 따라 필드를 동적으로 표시
function handleAssetTypeChange(assetTypeSelect) {
    const assetFields = assetTypeSelect.closest('.asset-entry').querySelector('.assetFields');
    const cashField = assetFields.querySelector('.cashField');
    const realEstateField = assetFields.querySelector('.realEstateField');
    const stockQuantityField = assetFields.querySelector('.stockQuantityField');
    const stockPriceField = assetFields.querySelector('.stockPriceField');
    const stockTotalField = assetFields.querySelector('.stockTotalField');
    const othersField = assetFields.querySelector('.othersField');

    // 모든 필드 숨기기
    cashField.style.display = 'none';
    realEstateField.style.display = 'none';
    stockQuantityField.style.display = 'none';
    stockPriceField.style.display = 'none';
    stockTotalField.style.display = 'none';
    othersField.style.display = 'none';

    // 선택된 유형에 따라 표시
    switch (assetTypeSelect.value) {
        case 'cash':
            cashField.style.display = 'block';
            break;
        case 'realEstate':
            realEstateField.style.display = 'block';
            break;
        case 'stock':
            stockQuantityField.style.display = 'block';
            stockPriceField.style.display = 'block';
            stockTotalField.style.display = 'block';
            break;
        case 'others':
            othersField.style.display = 'block';
            break;
    }
}

    // ✅ 공용 함수: 금융재산 공제 계산 (현금 & 주식)
function calculateFinancialExemption() {
    let totalFinancialAssets = 0;

    // 모든 자산을 검사하여 금융재산(현금 + 주식) 합산
    document.querySelectorAll('.asset-entry').forEach(asset => {
        let assetType = asset.querySelector('.assetType')?.value;
        let assetValue = parseFloat(asset.querySelector('.assetValue')?.value.replace(/,/g, '')) || 0;
        if (assetType === 'cash' || assetType === 'stock') {
            totalFinancialAssets += assetValue;
        }
    });

    // 금융재산 공제 계산: 금융재산의 20% (최대 2억)
    let financialExemption = Math.min(totalFinancialAssets * 0.2, 200000000);

    console.log("💰 총 금융재산:", totalFinancialAssets.toLocaleString(), "원");
    console.log("📉 적용된 금융재산 공제:", financialExemption.toLocaleString(), "원");

    return financialExemption;
}
   
// ✅ 개인 관계 공제 계산 로직 (일괄공제 최소 5억 보장)
function calculateExemptions(totalInheritance, relationship, spouseShare = 0, parentAge = 0, minorChildAge = 0, hasFinancialAssets = false) {
    const basicExemption = 200000000; // 기초 공제 (2억 원)
    let relationshipExemption = 0;
    let spouseExtraExemption = 0; // 배우자 추가 공제
    let financialExemption = hasFinancialAssets ? 200000000 : 0; // 금융재산 공제 최대 2억 원
    let generalExemption = 500000000; // 일괄공제 (최소 5억)

    switch (relationship) {
        case 'spouse': 
            relationshipExemption = 500000000; // 배우자 기본 공제 (5억 원)
            
            // ✅ 배우자가 실제 상속받은 금액을 기준으로 추가 공제 (최대 30억)
            if (spouseShare > 500000000) {
                spouseExtraExemption = Math.min(spouseShare - 500000000, 3000000000);
            }
            break;

        case 'adultChild': 
            relationshipExemption = 50000000; // 성년 자녀 공제 (5천만 원)
            break;

        case 'minorChild': 
            const yearsUntilAdult = Math.max(19 - minorChildAge, 0);
            relationshipExemption = Math.max(yearsUntilAdult * 10000000, 500000000); // 미성년자 최소 5억 보장
            break;

        case 'parent': 
             relationshipExemption = 50000000; // ✅ 부모는 60세 이상 여부 관계없이 무조건 5천만 원 공제
             break;
        case 'sibling':
        case 'other':
            relationshipExemption = 10000000; // 기타 상속인 공제 (천만 원)
            break;

        default:
            console.error('잘못된 관계 선택:', relationship);
            return { basicExemption, relationshipExemption: 0, totalExemption: 0 };
    }

    // ✅ 배우자가 아닌 경우, 최소 5억 보장
    if (relationship !== 'spouse') {
        generalExemption = 500000000; // 최소 5억
    }

    // 🔥 금융재산 공제는 일괄공제(5억)에 포함하지 않고, 별도로 추가 적용
    let totalExemption = generalExemption + financialExemption;

    console.log(`✅ 최종 공제 계산: 일괄공제(${generalExemption}) + 금융재산공제(${financialExemption}) = ${totalExemption}`);
    
    return { 
        basicExemption, 
        relationshipExemption, 
        spouseExtraExemption, // 배우자 추가 공제 값 반환
        generalExemption, // 일괄공제 (5억) 칸 추가
        financialExemption, // 금융재산 공제 칸 추가
        totalExemption 
    };
}

// ✅ 과세표준 계산 함수 (기존 코드 유지)
function calculateTaxableAmount(totalInheritance, exemptions) {
    return Math.max(totalInheritance - exemptions.totalExemption, 0); // 음수일 경우 0 처리
}

 /**
 * 상속세 계산 함수 (누진세 적용)
 * @param {number} taxableAmount - 과세 표준 금액
 * @returns {number} 계산된 상속세 금액
 */
function calculateTax(taxableAmount) {
    if (taxableAmount <= 0) return 0; // 과세 표준이 0 이하이면 세금 없음

    // ✅ 누진세 구간별 세율 및 누진 공제
    const taxBrackets = [
        { threshold: 100000000, rate: 0.1, deduction: 0 },           // 1억 이하: 10%
        { threshold: 500000000, rate: 0.2, deduction: 10000000 },    // 5억 이하: 20% (누진공제 1천만 원)
        { threshold: 1000000000, rate: 0.3, deduction: 60000000 },   // 10억 이하: 30% (누진공제 6천만 원)
        { threshold: 3000000000, rate: 0.4, deduction: 160000000 },  // 30억 이하: 40% (누진공제 1억6천만 원)
        { threshold: 10000000000, rate: 0.5, deduction: 460000000 }  // 100억 이하: 50% (누진공제 4억6천만 원)
    ];

    let tax = 0;

    // ✅ 과세 표준에 맞는 세율 적용
    for (let i = taxBrackets.length - 1; i >= 0; i--) {
        if (taxableAmount > taxBrackets[i].threshold) {
            tax = (taxableAmount * taxBrackets[i].rate) - taxBrackets[i].deduction;
            break;
        }
    }

    console.log(`📢 과세 표준: ${taxableAmount.toLocaleString()} 원`);
    console.log(`📢 계산된 상속세: ${tax.toLocaleString()} 원`);

    return Math.max(tax, 0); // 음수 방지
}
    
    // 주식 총액을 assetValue에 포함
document.addEventListener('input', () => {
    const stockQuantity = document.getElementById('stockQuantity');
    const stockPrice = document.getElementById('stockPrice');
    const stockTotal = document.getElementById('stockTotal');

    if (stockQuantity && stockPrice && stockTotal) {
        const quantity = parseInt(stockQuantity.value.replace(/[^0-9]/g, '') || '0', 10);
        const price = parseInt(stockPrice.value.replace(/[^0-9]/g, '') || '0', 10);
        stockTotal.value = (quantity * price).toLocaleString(); // 총 금액 계산
        stockTotal.classList.add('assetValue'); // assetValue 클래스를 추가하여 총액 계산에 포함
    }
});    
    
/**
 * 개인 상속 계산 함수
 * @param {number} totalAssetValue - 총 상속 재산 금액
 */
function calculatePersonalMode(totalAssetValue) {
    const relationship = document.getElementById('relationshipPersonal')?.value || 'other';
    const assetType = document.getElementById('assetType')?.value || 'realEstate'; // 기본값 부동산

    // ✅ 부모 연령 가져오기 (필요 없음, 삭제 가능)
    let parentAge = 0;
    let parentAgeSelect = document.getElementById('parentAge');
    if (relationship === 'parent' && parentAgeSelect) {
        parentAge = parseInt(parentAgeSelect.value) || 0;
    }

    // ✅ 미성년 자녀 나이 가져오기
    let minorChildAge = 0;
    let minorChildAgeInput = document.getElementById('minorChildAge');
    if (relationship === 'minorChild' && minorChildAgeInput) {
        minorChildAge = parseInt(minorChildAgeInput.value) || 0;
    }

    // ✅ 공제 계산 (기초 공제 + 관계 공제)
    let { basicExemption, relationshipExemption } = calculateExemptions(
        totalAssetValue, relationship, totalAssetValue, parentAge, minorChildAge
    );

    // ✅ 배우자 추가 공제 (배우자만 적용)
    let spouseAdditionalExemption = 0;
    if (relationship === 'spouse') {
        spouseAdditionalExemption = Math.max(0, Math.min(totalAssetValue - 700000000, 2300000000));
    }

    // ✅ 배우자가 아닐 경우, 최종 공제액이 5억 미만이면 5억 보장 (일괄 공제)
    let generalExemption = (basicExemption + relationshipExemption < 500000000) ? 500000000 : 0;

    // ✅ 금융재산 공제 추가 (현금 또는 주식 선택 시에만 적용)
    let financialExemption = (assetType === 'cash' || assetType === 'stock') ? calculateFinancialExemption(totalAssetValue) : 0;

    // ✅ 최종 공제 계산
    let totalExemption = basicExemption + relationshipExemption + financialExemption;
    if (relationship === 'spouse') {
        totalExemption += spouseAdditionalExemption;
    } else {
      totalExemption = Math.max(basicExemption + relationshipExemption, generalExemption) + financialExemption;
    }
    
    // ✅ 과세 금액 계산
    const taxableAmount = Math.max(totalAssetValue - totalExemption, 0);

    // ✅ 상속세 계산
    const tax = calculateTax(taxableAmount);

    // ✅ 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (개인 상속)</h3>
        <p>총 재산 금액: ${totalAssetValue.toLocaleString()} 원</p>
        <p><strong>공제 내역:</strong></p>
        <ul>
            <li>기초 공제: ${basicExemption.toLocaleString()} 원</li> 
            <li>관계 공제: ${relationshipExemption.toLocaleString()} 원 (${relationship})</li>
            ${relationship === 'spouse' ? 
                `<li>배우자 추가 공제: ${spouseAdditionalExemption.toLocaleString()} 원</li>` : 
                `<li>일괄 공제: ${generalExemption.toLocaleString()} 원</li>`}
            ${(assetType === 'cash' || assetType === 'stock') ? 
                `<li>금융재산 공제: ${financialExemption.toLocaleString()} 원</li>` : ''}
        </ul>
        <p><strong>최종 공제 금액:</strong> ${totalExemption.toLocaleString()} 원</p>
        <p>과세 표준: ${taxableAmount.toLocaleString()} 원</p>
        <p>상속세: ${tax.toLocaleString()} 원</p>
    `;
}

 /**
 * ✅ 전원 상속 관계 공제 계산 함수 (미성년자 나이 입력 문제 해결)
 * @param {string} relationship - 상속인의 관계 (배우자, 성년 자녀, 미성년 자녀, 부모 등)
 * @param {number} age - 상속인의 나이
 * @returns {number} - 관계 공제 금액
 */
function calculateRelationshipExemption(relationship, age = 0) {
    if (relationship === 'minorChild') {
        const yearsUntilAdult = Math.max(19 - age, 0); // 미성년자 공제 계산
        return yearsUntilAdult * 10000000; // 1천만 원 × (19 - 나이)
    }

    switch (relationship) {
        case 'spouse': 
            return 500000000; // ✅ 배우자 공제 5억 원 포함
        case 'adultChild': 
            return 50000000; // 성년 자녀: 5천만 원
        case 'parent': 
            return 50000000; // 부모: 5천만 원
        case 'sibling': 
            return 10000000; // 형제자매: 1천만 원
        case 'other': 
            return 10000000; // 기타 상속인: 1천만 원
        default: 
            return 0;
    }
}

// ✅ 배우자 공제(5억 원) 및 배우자 추가 공제(최대 30억 원) 계산 함수
function calculateSpouseExemption(spouseShare, totalAssetValue) {
    let spouseBasicExemption = 500000000; // ✅ 기본 공제 5억 원
    let spouseActualInheritance = (spouseShare / 100) * totalAssetValue; // 배우자가 실제 상속받은 금액

    let spouseAdditionalExemption = Math.min(spouseActualInheritance * 0.5, 3000000000); // 추가 공제 (최대 30억 원)

    return { spouseBasicExemption, spouseAdditionalExemption, totalExemption: spouseBasicExemption + spouseAdditionalExemption };
}

 // ✅ 전원 상속 계산 함수 (금융재산 공제 포함)
function calculateGroupMode(totalAssetValue) {
    const heirContainer = document.querySelector('#groupSection #heirContainer');

    let totalBasicExemption = 200000000; // 기초공제 2억 원
    let totalRelationshipExemption = 0; // 관계 공제 합계 (배우자 포함)
    let totalFinancialAssets = 0; // 금융재산 총액
    let heirs = [];

    // ✅ 금융재산 총액 계산
    document.querySelectorAll('.asset-entry').forEach(asset => {
        let assetType = asset.querySelector('.assetType')?.value;
        let assetValue = parseFloat(asset.querySelector('.assetValue')?.value.replace(/,/g, '')) || 0;

        if (assetType === 'cash' || assetType === 'stock') {
            totalFinancialAssets += assetValue;
        }
    });

    // ✅ 금융재산 공제 (총 금융재산의 20%, 최대 2억)
    let maxFinancialExemption = Math.min(totalFinancialAssets * 0.2, 200000000);

    // ✅ 상속인 정보 저장
    heirs = Array.from(heirContainer.querySelectorAll('.heir-entry')).map((heir) => {
        const name = heir.querySelector('.heirName')?.value.trim() || '이름 없음';
        const relationship = heir.querySelector('.relationship')?.value || 'other';
        let age = 0;

        if (relationship === 'minorChild') {
            const minorChildAgeInput = heir.querySelector('.minorChildAgeField');
            age = minorChildAgeInput && minorChildAgeInput.value ? parseInt(minorChildAgeInput.value) : 0;
        }

        const sharePercentage = parseFloat(heir.querySelector('.sharePercentageField')?.value || '0');
        let relationshipExemption = calculateRelationshipExemption(relationship, age);

        return { name, relationship, age, sharePercentage, relationshipExemption };
    });

    // ✅ 배우자 기본 공제 적용
    let spouse = heirs.find(h => h.relationship === 'spouse');

    if (spouse) {
        totalRelationshipExemption += 500000000; // 배우자 기본 공제(5억 원) 추가
    }

    // ✅ 기타 상속인의 관계 공제 적용 (배우자 제외)
    heirs.forEach((heir) => {
        if (heir.relationship !== 'spouse') {
            totalRelationshipExemption += heir.relationshipExemption;
        }
    });

    // ✅ 배우자 추가 공제 변수 선언 (기본값 설정)
    let spouseExemptions = { spouseBasicExemption: 0, spouseAdditionalExemption: 0, totalExemption: 0 };

    if (spouse) {
        spouseExemptions = calculateSpouseExemption(spouse.sharePercentage, totalAssetValue);
    }

    // ✅ 전체 과세 표준 계산 (배우자 추가 공제는 적용하지 않음)
    let totalExemption = totalBasicExemption + totalRelationshipExemption + maxFinancialExemption;
    let taxableAmount = Math.max(totalAssetValue - totalExemption, 0);

    let finalTotalTax = calculateTax(taxableAmount); // ✅ 최종 상속세 계산

    // ✅ 개별 상속세 계산 (배우자 추가 공제 반영)
    heirs = heirs.map((heir) => {
        const shareAmount = (totalAssetValue * heir.sharePercentage) / 100;
        const basicExemption = (totalBasicExemption * heir.sharePercentage) / 100;
        const individualFinancialExemption = (maxFinancialExemption * heir.sharePercentage) / 100;

        let finalTaxableAmount = Math.max(
            shareAmount - heir.relationshipExemption - basicExemption - individualFinancialExemption,
            0
        );

        // ✅ 배우자일 경우 추가 공제 적용
        if (heir.relationship === 'spouse') {
            finalTaxableAmount = Math.max(finalTaxableAmount - spouseExemptions.spouseAdditionalExemption, 0);
        }

        const tax = (finalTaxableAmount > 0) ? calculateTax(finalTaxableAmount) : 0;

        return {
            ...heir,
            shareAmount,
            basicExemption,
            financialExemption: individualFinancialExemption,
            finalTaxableAmount,
            tax
        };
    });

    // ✅ 최종 결과지 수정 (금융재산 공제 추가)
    document.getElementById('result').innerHTML = `
     <h3>총 상속 금액: ${totalAssetValue.toLocaleString()} 원</h3>
     <h3>기초 공제: ${totalBasicExemption.toLocaleString()} 원</h3>
     <h3>관계 공제 합계: ${totalRelationshipExemption.toLocaleString()} 원</h3>
     <h3>금융재산 공제: ${maxFinancialExemption.toLocaleString()} 원</h3>
     <h3>최종 과세 표준: ${taxableAmount.toLocaleString()} 원</h3>
     <h3>최종 상속세: ${finalTotalTax.toLocaleString()} 원</h3>

     <h3>개별 상속인 결과</h3>
     ${heirs.map((heir) => ` 
          <p>
             <strong>${heir.name}</strong> (${heir.sharePercentage}% 지분): ${heir.shareAmount.toLocaleString()} 원<br>
             관계 공제: ${heir.relationshipExemption.toLocaleString()} 원 (${heir.relationship})<br>
             기초 공제: ${heir.basicExemption.toLocaleString()} 원<br>
             금융재산 공제: ${heir.financialExemption.toLocaleString()} 원<br>
             ${heir.relationship === 'spouse' ? `<strong>배우자 추가 공제:</strong> ${spouseExemptions.spouseAdditionalExemption.toLocaleString()} 원<br>` : ''}
             <strong>과세 표준:</strong> ${heir.finalTaxableAmount.toLocaleString()} 원<br>
             <strong>개별 상속세:</strong> ${heir.tax.toLocaleString()} 원
         </p>
     `).join('')}
    `;
}

    /**
 * ✅ 법정 상속 계산 함수 (민법에 따른 법정 상속 비율 자동 적용)
 * @description 법정 상속 방식으로 상속인의 법정 지분을 자동 계산하고, 
 * 상속세 및 관계 공제를 적용하여 최종 과세 표준과 상속세를 산출합니다.
 * @returns {void} - 결과를 화면에 출력
 */

// ✅ 법정 상속 자동 비율 적용 함수
function applyLegalShares() {
    let heirs = document.querySelectorAll("#legalHeirContainer .heir-entry");
    let totalInheritance = 1.5; // 배우자 1.5
    let numChildren = 0;
    let inheritanceShares = {};

    // ✅ 자녀 수 계산
    heirs.forEach(heir => {
        let relationship = heir.querySelector(".relationship").value;
        if (relationship === "adultChild" || relationship === "minorChild") {
            numChildren++;
        }
    });

    totalInheritance += numChildren; // 배우자 1.5 + 자녀 1씩 추가
    let spouseShare = numChildren > 0 ? 1.5 / totalInheritance : 1;
    let childShare = numChildren > 0 ? 1 / totalInheritance : 0;

    // ✅ 각 상속인의 법정 지분 계산
    heirs.forEach(heir => {
        let name = heir.querySelector(".heirName").value || "상속인";
        let relationship = heir.querySelector(".relationship").value;
        inheritanceShares[name] = (relationship === "spouse") ? spouseShare : childShare;
    });

    return inheritanceShares;
}

/**
 * ✅ 법정 상속 계산 함수 (민법에 따른 법정 상속 비율 자동 적용)
 */
function calculateLegalInheritance() {
    let assetElement = document.querySelector("#cashAmount, #realEstateValue, #stockTotal, #othersValue");
    let totalAssetValue = assetElement ? parseInt(assetElement.value.replace(/,/g, "")) || 0 : 0;

    let heirs = document.querySelectorAll("#legalHeirContainer .heir-entry");
    let numChildren = 0;
    let spouseExists = false;
    let totalRelationshipExemption = 0;
    let relationshipExemptions = {}; // ✅ 개별 관계 공제 저장

    // ✅ 배우자 및 자녀 수 확인
    heirs.forEach(heir => {
        let relationship = heir.querySelector(".relationship").value;
        if (relationship === "spouse") spouseExists = true;
        if (relationship === "adultChild" || relationship === "minorChild") numChildren++;
    });

    // ✅ 법정 지분 계산: 배우자(1.5) + 자녀(1씩)
    let totalInheritance = (spouseExists ? 1.5 : 0) + numChildren;
    let spouseShare = spouseExists ? (1.5 / totalInheritance) : 0;
    let childShare = numChildren > 0 ? (1 / totalInheritance) : 0;

    // ✅ 배우자 관계공제 (5억 고정) + 추가 공제 (상속 지분 내에서 최대 30억)
    let spouseInheritanceAmount = Math.round(totalAssetValue * spouseShare);
    let spouseRelationshipExemption = spouseExists ? 500000000 : 0; // 배우자 관계공제 (5억)
    let spouseAdditionalExemption = spouseExists ? Math.max(spouseInheritanceAmount - spouseRelationshipExemption, 0) : 0;

    // ✅ 배우자 외 상속인의 관계 공제 계산
    heirs.forEach(heir => {
        let name = heir.querySelector(".heirName").value || "상속인";
        let relationship = heir.querySelector(".relationship").value;
        let minorChildAgeField = heir.querySelector(".minorChildAgeField");
        let minorChildAge = minorChildAgeField && minorChildAgeField.value ? parseInt(minorChildAgeField.value) : 0;
        
        let relationshipExemption = 0;
        if (relationship === "spouse") {
            relationshipExemption = spouseRelationshipExemption; // ✅ 배우자 관계공제 (5억) 적용
        } else if (relationship === "adultChild") {
            relationshipExemption = 50000000; // 성년 자녀 공제 (5천만 원)
        } else if (relationship === "minorChild") {
            relationshipExemption = Math.min((19 - minorChildAge) * 10000000, 190000000); // 미성년자 공제 (최대 1,900만 원)
        } else if (relationship === "parent") {
            relationshipExemption = 50000000; // 부모 공제 (5천만 원)
        } else if (relationship === "sibling") {
            relationshipExemption = 10000000; // 형제자매 공제 (1천만 원)
        } else {
            relationshipExemption = 10000000; // 기타 상속인 공제 (1천만 원)
        }

        relationshipExemptions[name] = relationshipExemption; // ✅ 개별 공제 값 저장
        totalRelationshipExemption += relationshipExemption;
    });

    // ✅ 일괄 공제 (5억)
    let lumpSumExemption = 500000000; 

    // ✅ 최종 과세 표준 계산
    let totalTaxableAmount = Math.max(totalAssetValue - lumpSumExemption - spouseRelationshipExemption - spouseAdditionalExemption, 0);
    let totalInheritanceTax = calculateTax(totalTaxableAmount);
    let individualResults = [];

    // ✅ 개별 상속인의 과세 표준 및 상속세 계산
    let totalChildTaxableAmount = totalTaxableAmount; // 배우자는 0원, 자녀만 과세 표준 계산
    let childTaxableAmount = numChildren > 0 ? Math.floor(totalChildTaxableAmount / numChildren) : 0; // ✅ 소수점 제거

    heirs.forEach(heir => {
        let name = heir.querySelector(".heirName").value || "상속인";
        let relationship = heir.querySelector(".relationship").value;
        let share = (relationship === "spouse") ? spouseShare : childShare;
        let inheritanceAmount = Math.round(totalAssetValue * share);
        let individualTaxableAmount = (relationship === "spouse") ? 0 : Math.round(childTaxableAmount);
        let individualTax = calculateTax(individualTaxableAmount);

        // ✅ 5억 이하일 경우 개별 관계 공제는 따로 표시하지 않음
        let relationshipExemptionText = (totalRelationshipExemption > lumpSumExemption) ?
            `${relationshipExemptions[name].toLocaleString()} 원 (${relationship})` : `-`;

        individualResults.push(`
            <p><strong>${name}</strong> (${(share * 100).toFixed(2)}% 지분): ${inheritanceAmount.toLocaleString()} 원<br>
            관계 공제: ${relationshipExemptionText}<br>
            <strong>과세 표준:</strong> ${individualTaxableAmount.toLocaleString()} 원<br>
            <strong>개별 상속세:</strong> ${individualTax.toLocaleString()} 원</p>
        `);
    });

    // ✅ 결과 출력
    let resultHTML = `
       <h3>총 상속 금액: ${totalAssetValue.toLocaleString()} 원</h3>`;

    // ✅ 배우자가 있는 경우에만 "배우자 관계공제"와 "배우자 추가공제" 표시
    if (spouseExists) {
        resultHTML += `
        <h3>배우자 관계공제: ${spouseRelationshipExemption.toLocaleString()} 원</h3>
        <h3>배우자 추가공제: ${spouseAdditionalExemption.toLocaleString()} 원</h3>`;
    }

    resultHTML += `
        <h3>일괄 공제: ${lumpSumExemption.toLocaleString()} 원</h3>
        <h3>과세 표준: ${totalTaxableAmount.toLocaleString()} 원</h3>
        <h3>총 상속세: ${totalInheritanceTax.toLocaleString()} 원</h3>
        <h3>개별 상속인 결과</h3>
        ${individualResults.join("")}
    `;

    document.getElementById('result').innerHTML = resultHTML;
}

// ✅ 계산 버튼 이벤트 리스너 추가
document.getElementById('calculateButton').addEventListener('click', () => {
    calculateLegalInheritance();
});
   
    /**
 * 가업 공제 계산 (공용)
 * @param {number} heirAssetValue - 상속인의 상속 재산 금액
 * @param {string} heirType - 상속인의 유형 ('adultChild', 'minorChild', 'other')
 * @param {number} years - 피상속인의 가업 경영 연수
 * @returns {number} 가업 공제 금액
 */
function calculateGaupExemption(heirAssetValue, heirType, years) {
    // 경영 연수에 따른 공제 한도 계산
    function getGaupExemptionLimitByYears(years) {
        if (years >= 30) return 60000000000; // 30년 이상: 최대 600억 원
        if (years >= 20) return 40000000000; // 20년 이상: 최대 400억 원
        if (years >= 10) return 30000000000; // 10년 이상: 최대 300억 원
        return 0; // 10년 미만: 공제 불가
    }

    // 1. 경영 연수에 따른 한도 계산
    const maxExemptionByYears = getGaupExemptionLimitByYears(years);

    // 2. 후계자 유형별 최대 공제 금액 계산
    let maxExemptionByType = 0;
    switch (heirType) {
        case 'adultChild': // 성년 자녀
            maxExemptionByType = heirAssetValue; // 100% 공제 가능
            break;
        case 'minorChild': // 미성년 자녀
            maxExemptionByType = heirAssetValue; // 100% 공제 가능
            break;
        case 'other': // 기타 후계자
            maxExemptionByType = heirAssetValue * 0.5; // 50% 공제 가능
            break;
        default:
            console.error('잘못된 후계자 유형:', heirType);
            return 0;
    }

    // 3. 최종 공제 금액
    const gaupExemption = Math.min(maxExemptionByYears, maxExemptionByType, heirAssetValue);

    console.log(`${heirType} 유형의 가업 공제 금액 (경영 연수 ${years}년):`, gaupExemption);
    return gaupExemption;
}

    // ✅ 가업 개인 상속 계산 함수 (일괄 공제 + 가업 공제 + 금융재산 공제 반영)
function calculateBusinessPersonalMode(totalAssetValue) {
    // ✅ 후계자 유형 가져오기
    const heirType = document.querySelector('#businessHeirTypePersonal')?.value || 'other';

    // ✅ 가업 경영 연수 가져오기
    let businessYears = parseInt(document.querySelector('#businessYearsGroup')?.value) || 0;

    // ✅ 기본 일괄 공제 (5억 원)
    let defaultGaupExemption = 500000000;

    // ✅ 가업 공제 계산 (가업 경영 연수에 따라 다름)
    let gaupExemption = 0;
    if (businessYears >= 30) {
        gaupExemption = Math.min(totalAssetValue, 60000000000); // 30년 이상: 600억
    } else if (businessYears >= 20) {
        gaupExemption = Math.min(totalAssetValue, 40000000000); // 20년 이상: 400억
    } else if (businessYears >= 10) {
        gaupExemption = Math.min(totalAssetValue, 30000000000); // 10년 이상: 300억
    } else {
        gaupExemption = 0; // 10년 미만은 가업 공제 없음
    }

    // ✅ 금융재산 총액 계산 (현금 + 주식)
    let totalFinancialAssets = 0;
    document.querySelectorAll('.asset-entry').forEach(asset => {
        let assetType = asset.querySelector('.assetType')?.value;
        let assetValue = parseFloat(asset.querySelector('.assetValue')?.value.replace(/,/g, '')) || 0;

        if (assetType === 'cash' || assetType === 'stock') {
            totalFinancialAssets += assetValue;
        }
    });

    // ✅ 금융재산 공제 (총 금융재산의 20%, 최대 2억 원)
    let financialExemption = Math.min(totalFinancialAssets * 0.2, 200000000);

    // ✅ 총 공제 금액 계산
    let totalExemption = defaultGaupExemption + gaupExemption + financialExemption; // ✅ 일괄 공제 포함

    // ✅ 과세 금액 계산
    let taxableAmount = Math.max(totalAssetValue - totalExemption, 0);

    // ✅ 상속세 계산
    let tax = calculateTax(taxableAmount);

    // ✅ 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (가업 개인 상속)</h3>
        <p>총 재산 금액: ${totalAssetValue.toLocaleString()} 원</p>
        <p><strong>공제 내역:</strong></p>
        <ul>
            <li>일괄 공제: ${defaultGaupExemption.toLocaleString()} 원</li>
            <li>가업 공제: ${gaupExemption.toLocaleString()} 원 (가업 경영 ${businessYears}년)</li>
            <li>금융재산 공제: ${financialExemption.toLocaleString()} 원</li>
        </ul>
        <p><strong>총 공제 금액:</strong> ${totalExemption.toLocaleString()} 원</p>
        <p>과세 표준: ${taxableAmount.toLocaleString()} 원</p>
        <p>상속세: ${tax.toLocaleString()} 원</p>
    `;
}

    // ✅ 특수(기타) 상속 계산 함수 추가
   function calculateSpecialInheritance() {
    console.log("✅ 특수상속 계산 시작");

    // ✅ 상속 재산 입력 필드 가져오기
    let inheritanceInput = document.getElementById("realEstateValue");

    if (!inheritanceInput) {
        console.error(" 상속 재산 입력 필드가 존재하지 않습니다. HTML을 확인하세요.");
        alert(" 상속 재산 입력 필드가 없습니다.");
        return;
    }

    // ✅ 쉼표 제거 후 숫자로 변환
    let totalInheritance = parseInt(inheritanceInput.value.replace(/,/g, "")) || 0;

    // ✅ 디버깅 로그 추가
    console.log(" 입력된 총 상속 재산 값:", inheritanceInput.value);
    console.log(" 변환된 총 상속 재산 (쉼표 제거 후):", totalInheritance);

    // ✅ 입력값 검증
    if (isNaN(totalInheritance) || totalInheritance <= 0) {
        console.error(" 총 상속 재산 값이 올바르지 않습니다.");
        alert(" 총 상속 재산을 올바르게 입력하세요.");
        return;
    }

    // ✅ 특수상속 유형 가져오기
    let otherAssetType = document.getElementById("otherAssetType");
    let otherType = otherAssetType ? otherAssetType.value : null;

    console.log(" 선택된 특수상속 유형:", otherType);

    if (!otherType) {
        console.error(" 기타 상속 유형이 선택되지 않았습니다.");
        alert(" 상속 유형을 선택하세요.");
        return;
    }

    let deduction = 0;
    let policyMessage = "";
    let eligibilityMessage = "";

    // ✅ 특수상속 유형별 공제 계산
    switch (otherType) {
        case "dwelling": // 동거주택 (최대 6억 공제)
            deduction = Math.min(totalInheritance, 600000000);
            policyMessage = "동거주택 상속 공제는 피상속인이 1세대 1주택자이며, 상속인은 상속 개시일(사망일)까지 10년 이상 동거하며 무주택자여야 하며, 상속 개시일(사망일)이후 3년간 보유해야 합니다.(최대 6억 공제)";
            eligibilityMessage = "✅ 10년 이상 동거 및 무주택 조건 충족";
            break;

        case "farming": // 농림재산 (최대 15억 공제)
            deduction = Math.min(totalInheritance, 1500000000);
            policyMessage = "농림재산 상속 공제는  피상속인이 10년 이상 직접 경작했어야 하며, 상속인은 상속 개시일(사망일)까지 10년 이상 함께 영농했어야하며, 상속 개시일(사망일) 이후 3년 이상 영농을 지속해야 합니다.(최대 15억 공제)";
            eligibilityMessage = "✅ 10년 이상 자경 요건 충족";
            break;

        case "factory": // 공장 상속 (80% 공제, 최대 20억)
            deduction = Math.min(totalInheritance * 0.8, 2000000000);
            policyMessage = "공장 상속 공제는 피상속인이 10년 이상 직접 운영했어야 하며, 상속인은 상속 개시일(사망일) 이후 3년 이상 공장을 운영해야 합니다. (80% 또는 최대 20억)";
            eligibilityMessage = "✅ 10년 이상 공장 운영 요건 충족";
            break;

        default:
            console.error(" 잘못된 특수상속 유형 선택:", otherType);
            alert(" 올바른 특수상속 유형을 선택하세요.");
            return;
    }

    // ✅ 공제 금액 확인
    console.log(" 공제 금액:", deduction);

    // ✅ 과세 표준 계산 (공제 후 금액)
    let taxableAmount = Math.max(0, totalInheritance - deduction);
    console.log(" 계산된 과세 표준 (총 상속 재산 - 공제):", taxableAmount);

    if (taxableAmount === 0) {
        console.warn(" 공제 후 과세 표준이 0입니다. 세금이 계산되지 않습니다.");
        alert(" 공제 후 과세 표준이 0원입니다. 세금이 부과되지 않습니다.");
        return;
    }

    // ✅ `calculateTax()`를 한 번만 호출하여 정확한 값 계산
    let inheritanceTax = calculateTax(taxableAmount);

    console.log("📌 최종 상속세 계산 완료:", inheritanceTax);

    // ✅ 최종 결과 출력     
    document.getElementById("result").innerHTML = `
        <h3> 특수상속 계산 결과</h3>
        <p> 상속 유형: <strong>${otherAssetType.options[otherAssetType.selectedIndex].text}</strong></p>
        <p> 총 상속 재산: <strong>${totalInheritance.toLocaleString()} 원</strong></p>
        <p> 공제 금액: <strong>${deduction.toLocaleString()} 원</strong></p>
        <p> 과세 표준: <strong>${taxableAmount.toLocaleString()} 원</strong></p>
        <p> 최종 상속세: <strong>${inheritanceTax.toLocaleString()} 원</strong></p>
        <p style="color: blue; font-weight: bold;">ℹ️ ${policyMessage}</p>
        <p style="color: green; font-weight: bold;">✅ 요건 충족 여부: ${eligibilityMessage}</p>
    `;
}
    
   // ✅ 상속비용 모달
(function () {
    console.log("✅ 강제 실행 테스트 시작");

    let openModalButton = document.getElementById("openModal");
    let closeModalButton = document.getElementById("closeModal");
    let saveCostButton = document.getElementById("saveCost");
    let modal = document.getElementById("costModal");
    let overlay = document.getElementById("modalOverlay");

    // ✅ 모달 요소 확인
    console.log("🔍 openModalButton:", openModalButton);
    console.log("🔍 modal:", modal);
    console.log("🔍 overlay:", overlay);

    if (!openModalButton || !modal || !overlay) {
        console.error("❌ 모달 관련 요소를 찾을 수 없습니다. HTML을 확인하세요.");
        return;
    }

    // ✅ "상속비용" 버튼 클릭 시 모달 열기
    openModalButton.addEventListener("click", function () {
        console.log("✅ '상속비용' 버튼 클릭됨! 모달창 열기");
        modal.style.display = "block";
        overlay.style.display = "block";
    });

    // ✅ "닫기" 버튼 클릭 시 모달 닫기
    closeModalButton.addEventListener("click", function () {
        console.log("✅ '닫기' 버튼 클릭됨! 모달창 닫기");
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    // ✅ "저장" 버튼 클릭 시 입력된 비용을 합산하여 totalDeductibleCost에 저장
    saveCostButton.addEventListener("click", function () {
        let funeralCost = parseFloat(document.getElementById("funeralCost").value.replace(/,/g, '')) || 0;
        let legalFees = parseFloat(document.getElementById("legalFees").value.replace(/,/g, '')) || 0;
        let unpaidTaxes = parseFloat(document.getElementById("unpaidTaxes").value.replace(/,/g, '')) || 0;
        let debt = parseFloat(document.getElementById("debt").value.replace(/,/g, '')) || 0;

        // ✅ 총 공제 금액 계산
        let totalDeductibleCost = funeralCost + legalFees + unpaidTaxes + debt;

        // ✅ 디버깅 로그 출력
        console.log("총 공제 금액:", totalDeductibleCost);

        // ✅ 공제 금액을 alert으로 출력하여 확인
        alert(`총 공제 금액: ${totalDeductibleCost.toLocaleString()} 원`);

        // ✅ 공제 금액을 window 객체에 저장하여 calculateButton에서 참조 가능하도록 설정
        window.totalDeductibleCost = totalDeductibleCost;

        // ✅ 모달 닫기
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    // ✅ 오버레이 클릭 시 모달 닫기
    overlay.addEventListener("click", function () {
        console.log("✅ '오버레이' 클릭됨! 모달창 닫기");
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    console.log("✅ 강제 실행 완료");
})();

// ✅ 계산 버튼 클릭 시 총 상속 금액에서 상속 비용을 공제하도록 수정
document.getElementById('calculateButton').addEventListener('click', () => {
    const relationship = document.querySelector('#relationshipPersonalBusiness')?.value || 'other';
    const heirType = document.querySelector('#businessHeirTypePersonal')?.value || 'other';
   
    // ✅ 총 재산 금액 계산 (상속 비용 공제 적용)
    let totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
        const value = parseFloat(field.value.replace(/,/g, '')) || 0;
        return sum + value;
    }, 0);

    // ✅ window.totalDeductibleCost에서 상속 비용을 가져와 차감
    let totalDeductibleCost = window.totalDeductibleCost || 0;
    totalAssetValue -= totalDeductibleCost;

    // ✅ 음수 값 방지 (공제 후 0 이하가 되지 않도록 처리)
    totalAssetValue = Math.max(totalAssetValue, 0);

    console.log("📌 최종 상속 금액 (공제 적용 후):", totalAssetValue);
    console.log("📌 현재 선택된 상속 유형:", document.getElementById('inheritanceType').value); // 디버깅 추가

    // ✅ 상속 유형에 따라 계산 실행
    switch (document.getElementById('inheritanceType').value) {
        case 'personal':
            calculatePersonalMode(totalAssetValue);
            break;
        case 'group':
            calculateGroupMode(totalAssetValue);
            break;
        case 'businessPersonal':
            calculateBusinessPersonalMode(totalAssetValue);
            break;
        case 'other':  // ✅ 특수상속 추가
            calculateSpecialInheritance();  
            break;
        case 'legal': // ✅ 법정 상속 추가
            calculateLegalInheritance(totalAssetValue);
            break;
        default:
            console.error('⚠️ 잘못된 계산 요청 - 올바른 상속 유형을 선택하세요.');
            alert("⚠️ 올바른 상속 유형을 선택하세요.");
            break;
    }
});
    
// 숫자 포맷 함수
document.addEventListener('input', (event) => {
    const target = event.target;
    const applicableFields = [
        'cashAmount',
        'realEstateValue',
        'stockQuantity',
        'stockPrice',
        'stockTotal',
        'mixedCashAmount',
        'mixedRealEstateValue',
        'mixedStockPrice'
    ];

    if (applicableFields.includes(target.id)) {
        const rawValue = target.value.replace(/[^0-9]/g, '');
        target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : '';
    }
});

// 숫자 입력 필드에 콤마 추가
document.addEventListener('input', function (event) {
    const target = event.target;

    // 콤마 적용 대상 필드 ID
    const applicableFields = [
        'cashAmount',          // 현금
        'realEstateValue',     // 부동산 평가액
        'stockPrice',          // 주당 가격
        'stockTotal',          // 주식 총액
        'mixedCashAmount',     // 혼합 자산 현금
        'mixedRealEstateValue',// 혼합 자산 부동산
        'mixedStockPrice',     // 혼합 자산 주식
        'fatherAmountInput',   // 아버지 금액
        'motherAmountInput',   // 어머니 금액
        'totalAssetValue',     // 추가된 필드
    ];

    // 주식 수량은 제외 (콤마를 넣지 않음)
    if (target.id === 'stockQuantity') {
        return; // 콤마 처리 생략
    }

    // 해당 필드에 대해 콤마 적용
    if (applicableFields.includes(target.id)) {
        const rawValue = target.value.replace(/[^0-9]/g, ''); // 숫자 이외 문자 제거
        target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : ''; // 숫자에 콤마 추가
    }
});
     
// 주식 총 금액 계산
document.addEventListener('input', function () {
    const stockQuantity = document.getElementById('stockQuantity');
    const stockPrice = document.getElementById('stockPrice');
    const stockTotal = document.getElementById('stockTotal');

    if (stockQuantity && stockPrice && stockTotal) {
        const quantity = parseInt(stockQuantity.value.replace(/[^0-9]/g, '') || '0', 10);
        const price = parseInt(stockPrice.value.replace(/[^0-9]/g, '') || '0', 10);
        stockTotal.value = (quantity * price).toLocaleString();
    }

    const mixedStockQuantity = document.getElementById('mixedStockQuantity');
    const mixedStockPrice = document.getElementById('mixedStockPrice');
    const mixedTotalAmount = document.getElementById('mixedTotalAmount');

    if (mixedStockQuantity && mixedStockPrice && mixedTotalAmount) {
        const quantity = parseInt(mixedStockQuantity.value.replace(/[^0-9]/g, '') || '0', 10);
        const price = parseInt(mixedStockPrice.value.replace(/[^0-9]/g, '') || '0', 10);
        const total = quantity * price;
        const cash = parseInt(document.getElementById('mixedCashAmount').value.replace(/[^0-9]/g, '') || '0', 10);
        const realEstate = parseInt(document.getElementById('mixedRealEstateValue').value.replace(/[^0-9]/g, '') || '0', 10);

        mixedTotalAmount.value = (total + cash + realEstate).toLocaleString();
    }
});
       
}); // document.addEventListener 닫는 괄호 
