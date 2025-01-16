document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 참조
    const inheritanceType = document.getElementById('inheritanceType');
    const personalSection = document.getElementById('personalSection');
    const groupSection = document.getElementById('groupSection');
    const businessPersonalSection = document.getElementById('businessPersonalSection');
    const businessGroupSection = document.getElementById('businessGroupSection');
    const addAssetButton = document.getElementById('addAssetButton');
    const assetContainer = document.getElementById('assetContainer');
    const addHeirButton = document.getElementById('addHeirButton');
    const businessGroupHeirContainer = document.getElementById('businessGroupHeirContainer');
    const addBusinessGroupHeirButton = document.getElementById('addBusinessGroupHeirButton');
    const calculateButton = document.getElementById('calculateButton');
    const result = document.getElementById('result');

// 섹션 초기화 함수
function resetSections() {
    personalSection.style.display = 'none';
    groupSection.style.display = 'none';
    businessPersonalSection.style.display = 'none';
    businessGroupSection.style.display = 'none';
}

// 초기 로딩 시 개인 상속을 기본값으로 설정
function initializeDefaultView() {
    resetSections();
    personalSection.style.display = 'block'; // 개인 상속 섹션 기본값 표시
}

// 상속 유형 변경 이벤트 리스너
inheritanceType.addEventListener('change', () => {
    resetSections(); // 모든 섹션 숨김

    switch (inheritanceType.value) {
        case 'personal':
            personalSection.style.display = 'block';
            break;
        case 'group':
            groupSection.style.display = 'block';
            break;
        case 'businessPersonal':
            businessPersonalSection.style.display = 'block';
            break;
        case 'businessGroup':
            businessGroupSection.style.display = 'block';
            break;
        default:
            console.error('잘못된 상속 유형 선택');
            break;
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
    
 // "다시 하기" 버튼 이벤트 리스너
document.querySelectorAll('.removeAssetButton').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        // 해당 자산 항목을 초기화
        const assetEntry = button.closest('.asset-entry');
        if (assetEntry) {
            // 현재 자산 유형 유지
            const assetTypeSelect = assetEntry.querySelector('.assetType');
            const currentAssetType = assetTypeSelect.value;

            // 모든 입력 필드 초기화
            assetEntry.querySelectorAll('input').forEach((input) => {
                input.value = ''; // 입력 필드 초기화
            });

            // 필드 표시 상태를 초기화하면서 기존 자산 유형 유지
            assetTypeSelect.value = currentAssetType; // 자산 유형 복원
            handleAssetTypeChange(assetTypeSelect); // 필드 표시 상태 업데이트
        }

        // 전체 계산 필드 초기화
        document.querySelectorAll('.assetValue').forEach((input) => {
            input.value = ''; // 계산 필드 초기화
        });

        // 결과 영역 초기화
        const resultArea = document.getElementById('result');
        if (resultArea) {
            resultArea.innerHTML = ''; // 결과를 초기화
        }
    });
}); 

      // 초기화: 모든 .assetValue 필드에 콤마 이벤트 등록
document.querySelectorAll('.assetValue').forEach(addCommaFormatting);

// 초기 주식 입력 필드에 콤마 이벤트 등록 (초기 필드)
const initialStockPriceField = document.querySelector('.stockPriceField');
if (initialStockPriceField) {
    addCommaFormatting(initialStockPriceField); // 초기 필드 이벤트 등록
}

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
            <option value="adultChild">성년 자녀</option>
            <option value="minorChild">미성년 자녀</option>
            <option value="parent">부모</option>
            <option value="sibling">형제자매</option>
            <option value="other">기타</option>
        </select>
        <input type="number" class="sharePercentageField" placeholder="상속 비율 (%)">
    `;

    console.log('새로운 상속인 필드 추가 준비:', newHeirEntry);

    // 새로 추가된 상속 비율 필드 이벤트 등록
    const sharePercentageField = newHeirEntry.querySelector('.sharePercentageField');
    sharePercentageField.addEventListener('input', () => {
        const value = parseFloat(sharePercentageField.value) || 0;

        console.log('상속 비율 입력 값:', value);

        // 비율 검증: 범위 제한 (0~100)
        if (value < 0 || value > 100) {
            alert('상속 비율은 0%에서 100% 사이여야 합니다.');
            sharePercentageField.value = ''; // 잘못된 입력 초기화
            console.log('잘못된 입력 값으로 초기화됨');
            return;
        }

        // 전체 합 검증
        if (typeof validateSharePercentage === 'function' && !validateSharePercentage()) {
            sharePercentageField.value = ''; // 잘못된 입력 초기화
            console.log('전체 비율 검증 실패');
        }
    });

    console.log('상속인 필드 추가 완료:', newHeirEntry);
    heirContainer.appendChild(newHeirEntry); // DOM 추가
});

    // 기존 상속 비율 필드 이벤트 등록
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

// 가업 단체 상속: 상속인 추가 버튼 이벤트
addBusinessGroupHeirButton.addEventListener('click', () => {
    // 새 상속인 입력 필드 생성
    const newHeirEntry = document.createElement('div');
    newHeirEntry.className = 'heir-entry-group';
    newHeirEntry.innerHTML = `
        <!-- 후계자 유형 -->
        <select class="heirType">
            <option value="" disabled selected>후계자 유형</option>
            <option value="adultChild">성년 자녀</option>
            <option value="minorChild">미성년 자녀</option>
            <option value="other">기타</option>
        </select>

        <!-- 이름 -->
        <input type="text" placeholder="이름" class="heirName">

        <!-- 관계 -->
        <select class="relationship">
            <option value="" disabled selected>관계 선택</option>
            <option value="spouse">배우자</option>
            <option value="adultChild">성년 자녀</option>
            <option value="minorChild">미성년 자녀</option>
            <option value="parent">부모</option>
            <option value="sibling">형제자매</option>
            <option value="other">기타</option>
        </select>

        <!-- 상속 비율 -->
        <input type="number" class="sharePercentageField" placeholder="상속 비율 (%)">
    `;

    // 가업 단체 상속 섹션에 필드 추가
    const businessGroupSection = document.getElementById('businessGroupSection');
    const addButton = document.getElementById('addBusinessGroupHeirButton');

    if (businessGroupSection && addButton) {
        // 버튼 위에 새 상속인 필드를 삽입
        businessGroupSection.insertBefore(newHeirEntry, addButton);
    } else {
        console.error('businessGroupSection 또는 addBusinessGroupHeirButton을 찾을 수 없습니다.');
    }
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

// 재산 추가 버튼 이벤트
addAssetButton.addEventListener('click', createAssetEntry);    

/**
 * 관계 공제 계산 함수
 * @param {string} relationship - 상속인의 관계 (배우자, 성년 자녀 등)
 * @param {number} shareAmount - 상속 재산 금액
 * @returns {{
 *   relationshipExemption: number,
 *   baseExemption: number,
 *   finalExemption: number
 * }} 관계 공제, 기초 공제, 최종 공제 금액
 */
function calculateRelationshipExemption(relationship, shareAmount) {
    let relationshipExemption = 0; // 관계 공제 초기화
    const baseExemption = 200000000; // 기초 공제 (2억 원)
    const basicExemption = 500000000; // 기본 공제 (5억 원)
    const maxSpouseExemption = 3000000000; // 배우자 추가 공제 최대 (30억 원)

    switch (relationship) {
        case 'spouse': // 배우자
            relationshipExemption = 500000000; // 최소 5억 원 공제
            const additionalExemption = Math.min(
                shareAmount - baseExemption - relationshipExemption,
                maxSpouseExemption
            );
            relationshipExemption += Math.max(additionalExemption, 0); // 배우자 추가 공제 적용
            break;
        case 'adultChild': // 성년 자녀
            relationshipExemption = 50000000; // 5천만 원 공제
            break;
        case 'minorChild': // 미성년 자녀
            const remainingYears = Math.max(0, 19 - getAge()); // 미성년까지 남은 연수 계산
            relationshipExemption = 10000000 + remainingYears * 10000000; // 기본 1천만 원 + 연수당 1천만 원
            break;
        case 'parent': // 부모
            relationshipExemption = 100000000; // 1억 원 공제
            break;
        case 'sibling': // 형제자매
        case 'other': // 기타
            relationshipExemption = 10000000; // 1천만 원 공제
            break;
        default:
            console.error("잘못된 관계 입력:", relationship);
            return {
                relationshipExemption: 0,
                baseExemption: baseExemption,
                finalExemption: basicExemption
            };
    }

    const finalExemption = Math.max(
        relationshipExemption + baseExemption,
        basicExemption
    ); // 최소 5억 원 보장

    return {
        relationshipExemption,
        baseExemption,
        finalExemption
    };
}

    
/**
 * 성년까지 남은 년수 계산
 * @returns {number} 나이 계산 결과
 */
function getAge() {
  // 미성년자의 나이를 받아오는 로직 (예: 입력값에서 가져오기)
  // 이 예제에서는 임의로 15세로 설정
  return 15; // 임시 값
}

/**
 * 최종 공제 계산 함수
 * @param {number} relationshipExemption - 관계 공제 금액
 * @param {number} specialExemption - 특별 공제 금액 (기본값: 0)
 * @param {boolean} isSpouse - 배우자 여부
 * @returns {number} 최종 공제 금액
 */
function calculateFinalExemption(relationshipExemption, specialExemption = 0, isSpouse = false) {
  const baseExemption = 200000000; // 기초 공제 (2억 원)
  const basicExemption = 500000000; // 기본 공제 (5억 원)

  if (isSpouse) {
    // 배우자는 관계 공제 + 특별 공제만 적용
    return relationshipExemption + specialExemption;
  }

  // 기초 공제와 관계 공제를 합산
  const totalExemption = baseExemption + relationshipExemption;

  // 최소 5억 원 공제 보장
  return Math.max(totalExemption, basicExemption);
}

// 과세표준 계산 함수
function calculateTaxableAmount(totalInheritance, exemptions) {
    return Math.max(totalInheritance - exemptions.totalExemption, 0); // 음수일 경우 0 처리
}

/**
 * 누진세율 계산 함수
 * @param {number} taxableAmount - 과세 금액
 * @returns {number} 상속세 금액
 */
function calculateTax(taxableAmount) {
    const taxBrackets = [
        { limit: 100000000, rate: 0.1 },   // 1억 이하: 10%
        { limit: 500000000, rate: 0.2 },   // 1억 초과 ~ 5억: 20%
        { limit: 1000000000, rate: 0.3 },  // 5억 초과 ~ 10억: 30%
        { limit: 3000000000, rate: 0.4 },  // 10억 초과 ~ 30억: 40%
        { limit: Infinity, rate: 0.5 },    // 30억 초과: 50%
    ];

    let tax = 0;
    let previousLimit = 0;

    for (const bracket of taxBrackets) {
        if (taxableAmount > bracket.limit) {
            tax += (bracket.limit - previousLimit) * bracket.rate;
            previousLimit = bracket.limit;
        } else {
            tax += (taxableAmount - previousLimit) * bracket.rate;
            break;
        }
    }

    return Math.max(tax, 0); // 음수 방지
}

// "계산하기" 버튼 클릭 이벤트 리스너
document.getElementById('calculateButton').addEventListener('click', () => {
    // 모든 자산 입력 필드에서 값을 읽어 합산
    const totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
        const value = parseInt(field.value.replace(/,/g, '') || '0', 10);
        return sum + value;
    }, 0);

    // 관계 값 읽기
    const relationship = document.getElementById('relationshipPersonal').value;

    // 🛠️ 디버깅 로그 추가 (콘솔에서 값 확인)
    console.log('선택된 관계:', relationship);
    console.log('총 재산 금액:', totalAssetValue.toLocaleString());

    // 개인 상속 계산 실행
    calculatePersonalMode(totalAssetValue, relationship);
});


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
 * @param {string} relationship - 상속인의 관계 (예: spouse, adultChild 등)
 */
function calculateRelationshipExemption(relationship, shareAmount) {
    if (!relationship) {
        console.error("calculateRelationshipExemption: 관계 값이 undefined 입니다. 기본값 'other'을 사용합니다.");
        relationship = 'other';
    }

    let relationshipExemption = 0;
    const baseExemption = 200000000; // 기초 공제
    const maxSpouseExemption = 3000000000; // 배우자 추가 공제 최대 (30억 원)

    console.log('관계 공제 계산 - 입력된 관계:', relationship);

    switch (relationship) {
        case 'spouse':
            relationshipExemption = 500000000; // 5억 원 공제
            break;
        case 'adultChild':
            relationshipExemption = 50000000; // 5천만 원 공제
            break;
        case 'minorChild':
            const remainingYears = Math.max(0, 19 - getAge());
            relationshipExemption = 10000000 + remainingYears * 10000000;
            break;
        case 'parent':
            relationshipExemption = 100000000; // 1억 원 공제
            break;
        case 'sibling':
        case 'other':
            relationshipExemption = 10000000; // 1천만 원 공제
            break;
        default:
            console.error('잘못된 관계 입력:', relationship);
            return { relationshipExemption: 0, baseExemption, finalExemption: baseExemption };
    }

    console.log(`관계 공제 (${relationship}): ${relationshipExemption.toLocaleString()} 원`);

    const finalExemption = Math.max(relationshipExemption + baseExemption, baseExemption);

    return {
        relationshipExemption,
        baseExemption,
        finalExemption
    };
}
    
/**
 * 상속 결과 계산 (전체 상속)
 * @param {number} totalAssetValue - 총 상속 재산 금액
 */
function calculateGroupMode(totalAssetValue) {
    const heirContainer = document.querySelector('#groupSection #heirContainer');
    const heirs = Array.from(heirContainer.querySelectorAll('.heir-entry')).map((heir) => {
        const name = heir.querySelector('.heirName')?.value.trim() || '상속인';
        const relationship = heir.querySelector('.relationship')?.value || 'other';
        const sharePercentage = parseFloat(heir.querySelector('.sharePercentageField')?.value || '0');

        // 입력값 검증
        if (sharePercentage <= 0 || isNaN(sharePercentage)) {
            console.error(`${name}의 상속 비율이 올바르지 않습니다.`);
            return null;
        }

        // 상속인의 상속분 계산
        const shareAmount = (totalAssetValue * sharePercentage) / 100;

        // 각 상속인의 공제 계산
        const { relationshipExemption, basicExemption, finalExemption } = calculateRelationshipExemption(relationship, shareAmount);

        // 과세 금액 계산
        const taxableAmount = Math.max(shareAmount - finalExemption, 0);

        // 상속세 계산
        const tax = calculateTax(taxableAmount);

        // 상속인별 결과 반환
        return {
            name,
            shareAmount,
            relationship,
            relationshipExemption,
            basicExemption,
            finalExemption,
            taxableAmount,
            tax,
        };
    }).filter(Boolean);

    if (!heirs.length) {
        console.error('상속인이 없습니다.');
        return;
    }

    // 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (전체 상속)</h3>
        ${heirs.map(result => `
            <p>
                <strong>${result.name} (${result.relationship})</strong><br>
                상속분: ${result.shareAmount.toLocaleString()} 원<br>
                관계 공제: ${result.relationshipExemption.toLocaleString()} 원<br>
                기초 공제: ${result.basicExemption.toLocaleString()} 원<br>
                최종 공제 금액: ${result.finalExemption.toLocaleString()} 원<br>
                과세 금액: ${result.taxableAmount.toLocaleString()} 원<br>
                상속세: ${result.tax.toLocaleString()} 원
            </p>
        `).join('')}
    `;
}
    
  /**
 * 숫자에 콤마를 추가하는 함수 (가업개인/단체 공통)
 * @param {string|number|null|undefined} value - 콤마를 추가할 값
 * @returns {string} - 콤마가 추가된 문자열
 */
function formatNumberWithCommas(value) {
    if (value === null || value === undefined) {
        return '0'; // null 또는 undefined는 "0" 반환
    }

    // 숫자면 문자열로 변환
    if (typeof value === 'number') {
        value = value.toString();
    }

    // 문자열이 아닌 경우 에러 방지
    if (typeof value !== 'string') {
        console.error(`잘못된 값 전달: ${value}`);
        return '0';
    }

    // 문자열에서 숫자 외 문자를 제거하고 콤마 추가
    return parseInt(value.replace(/[^0-9]/g, '') || '0', 10).toLocaleString();
}

    // 유효성 검사 함수 (가업개인/단체 공통)
function validateHeirRelationship(heirType, relationship) {
    const validPairs = {
        adultChild: ['adultChild'], // 성년 자녀 후계자 -> 성년 자녀 관계만 허용
        minorChild: ['minorChild'], // 미성년 자녀 후계자 -> 미성년 자녀 관계만 허용
        other: ['spouse', 'parent', 'sibling', 'other'], // 기타 후계자 -> 부모, 형제자매, 기타만 허용
    };

    if (!validPairs[heirType]?.includes(relationship)) {
        return false; // 잘못된 조합
    }

    return true;
}

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

// 가업 개인 상속 함수
function calculateBusinessPersonalMode(totalAssetValue) {
    const heirType = document.querySelector('#businessHeirTypePersonal')?.value || 'other';
    const relationship = document.querySelector('#relationshipPersonalBusiness')?.value || 'other';

    // 가업 관계 공제 계산
    function calculateGaupRelationshipExemption() {
        // 가업 상속에서는 관계 공제 대신 모든 상속인에게 일괄 5억 원 공제
        return 500000000; // 일괄 5억 원
    }

    // 가업 공제 계산 함수 (가업 재산에 따라 공제)
    function calculateGaupExemption(heirAssetValue, heirType) {
        // 예제 가업 공제 로직 (후계자 유형과 자산 금액에 따라 공제 계산)
        const maxExemption = 1500000000; // 가업 공제 한도 (예: 15억 원)
        return Math.min(heirAssetValue, maxExemption); // 가업 공제는 상속 재산과 한도 중 작은 값 적용
    }

    const gaupExemption = calculateGaupExemption(totalAssetValue, heirType); // 가업 공제 계산
    const relationshipExemption = calculateGaupRelationshipExemption(); // 일괄 5억 원 공제

    // 총 공제 및 과세 금액 계산
    const totalExemption = gaupExemption + relationshipExemption;
    const taxableAmount = Math.max(totalAssetValue - totalExemption, 0);
    const tax = calculateTax(taxableAmount); // 상속세 계산 함수 호출

    // 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (가업 개인 상속)</h3>
        <p>총 재산 금액: ${formatNumberWithCommas(totalAssetValue)} 원</p>
        <p>가업 공제: ${formatNumberWithCommas(gaupExemption)} 원</p>
        <p>관계 공제: ${formatNumberWithCommas(relationshipExemption)} 원 (일괄 공제)</p>
        <p>총 공제 금액: ${formatNumberWithCommas(totalExemption)} 원</p>
        <p>과세 금액: ${formatNumberWithCommas(taxableAmount)} 원</p>
        <p>상속세: ${formatNumberWithCommas(tax)} 원</p>
    `;
}

  /**
 * 가업 단체 상속 계산 함수
 * @param {number} totalAssetValue - 총 상속 재산 금액
 */
function calculateBusinessGroupMode(totalAssetValue) {
    console.log('--- 가업 단체 상속 계산 시작 ---');
    console.log('총 재산 금액:', totalAssetValue);

    // 경영 연수 입력
    const years = parseInt(document.querySelector('#businessYears')?.value || '0', 10);

    // 각 상속인 정보 처리
    const heirs = Array.from(document.querySelectorAll('.heir-entry-group')).map((heir, index) => {
        const name = heir.querySelector('.heirName')?.value || `상속인 ${index + 1}`;
        const heirType = heir.querySelector('.heirType')?.value || 'other';
        const sharePercentage = parseFloat(heir.querySelector('.sharePercentageField')?.value || '0');
        const heirAssetValue = (totalAssetValue * sharePercentage) / 100;

        // 데이터 검증
        if (!name || sharePercentage <= 0) {
            console.error(`${name}의 데이터가 올바르지 않습니다.`);
            return null;
        }

        // 가업 공제 계산
        const gaupExemption = calculateGaupExemption(heirAssetValue, heirType, years);

        // 관계 공제: 일괄 5억 원 적용
        const relationshipExemption = 500000000;

        // 총 공제 계산
        const totalExemption = Math.min(heirAssetValue, gaupExemption + relationshipExemption);

        // 과세 금액 계산
        const taxableAmount = Math.max(heirAssetValue - totalExemption, 0);
        const tax = calculateTax(taxableAmount);

        // 계산 결과 로그
        console.log(`${name}의 계산 결과:`, {
            heirAssetValue,
            gaupExemption,
            relationshipExemption,
            totalExemption,
            taxableAmount,
            tax,
        });

        // 상속인별 결과 반환
        return { name, heirAssetValue, gaupExemption, relationshipExemption, totalExemption, taxableAmount, tax };
    }).filter(Boolean); // 유효한 데이터만 포함

    // 전체 결과 계산
    const totalInheritedAssets = heirs.reduce((sum, heir) => sum + heir.heirAssetValue, 0);
    const totalExemption = heirs.reduce((sum, heir) => sum + heir.totalExemption, 0);
    const totalTax = heirs.reduce((sum, heir) => sum + heir.tax, 0);

    // 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (가업 단체 상속)</h3>
        <p>총 상속 재산: ${formatNumberWithCommas(totalInheritedAssets)} 원</p>
        <p>총 공제 금액: ${formatNumberWithCommas(totalExemption)} 원</p>
        <p>총 상속세: ${formatNumberWithCommas(totalTax)} 원</p>
        ${heirs.map(heir => `
            <p>
                <strong>${heir.name}</strong>:<br>
                - 상속 재산: ${formatNumberWithCommas(heir.heirAssetValue)} 원<br>
                - 가업 공제: ${formatNumberWithCommas(heir.gaupExemption)} 원<br>
                - 관계 공제: ${formatNumberWithCommas(heir.relationshipExemption)} 원<br>
                - 총 공제 금액: ${formatNumberWithCommas(heir.totalExemption)} 원<br>
                - 과세 금액: ${formatNumberWithCommas(heir.taxableAmount)} 원<br>
                - 상속세: ${formatNumberWithCommas(heir.tax)} 원
            </p>
        `).join('')}
    `;
}
  
// 계산 버튼 이벤트
calculateButton.addEventListener('click', () => {
    const relationship = document.querySelector('#relationshipPersonalBusiness')?.value || 'other';
    const heirType = document.querySelector('#businessHeirTypePersonal')?.value || 'other';

    // 유효성 검사 실행
    if (!validateHeirRelationship(heirType, relationship)) {
        alert('선택한 후계자 유형과 관계가 맞지 않습니다. 올바른 조합을 선택해주세요.');
        return; // 계산 중단
    }

    // 총 재산 금액 계산
    const totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
        const value = parseInt(field.value.replace(/,/g, '') || '0', 10);
        return sum + value;
    }, 0);

    // 상속 유형에 따라 계산 실행
    switch (inheritanceType.value) {
        case 'personal': // 개인 상속
            calculatePersonalMode(totalAssetValue);
            break;
        case 'group': // 단체 상속
            calculateGroupMode(totalAssetValue);
            break;
        case 'businessPersonal': // 가업 개인 상속
            calculateBusinessPersonalMode(totalAssetValue);
            break;
        case 'businessGroup': // 가업 단체 상속
            calculateBusinessGroupMode(totalAssetValue);
            break;
        default:
            console.error('잘못된 계산 요청');
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
