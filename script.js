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
     document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("removeAssetButton")) {
        event.preventDefault();
        console.log("🔄 '다시 하기' 버튼 클릭됨! 추가된 입력 필드 닫기 & 입력값 초기화 실행!");

        // ✅ 모든 입력값 초기화 (숫자 입력 필드만)
        document.querySelectorAll("input").forEach(input => input.value = "");

        // ✅ 협의상속 - 추가된 상속인 입력 필드 삭제 (첫 번째 항목 유지)
        document.querySelectorAll("#heirContainer .heir-entry").forEach((heir, index) => {
            if (index !== 0) heir.remove(); 
        });

        // ✅ 법정상속 - 추가된 상속인 입력 필드 삭제 (첫 번째 항목 유지)
        document.querySelectorAll("#legalHeirContainer .heir-entry").forEach((heir, index) => {
            if (index !== 0) heir.remove(); 
        });

        // ✅ 협의상속 - 재산 입력 필드 초기화 (첫 번째 항목 유지)
        document.querySelectorAll("#assetContainer .asset-entry").forEach((asset, index) => {
            if (index !== 0) asset.remove();
        });

        // ✅ 결과창 초기화
        const resultArea = document.getElementById("result");
        if (resultArea) resultArea.innerHTML = "";

        console.log("✅ 초기화 완료! (최초 상속인 입력 필드는 유지됨)");
    }
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
Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
Editing test2-1/script.js at main · clubmbusan/test2-1

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
 

// ✅ 과세표준 계산 함수 (기존 코드 유지)
function calculateTaxableAmount(totalInheritance, exemptions) {
    return Math.max(totalInheritance - exemptions.totalExemption, 0); // 음수일 경우 0 처리
}

 /**
 * 상속세 계산 함수 (각 구간별 계산 후 누진공제 적용)
 * @param {number} taxableAmount - 과세 표준 금액
 * @returns {number} 계산된 상속세 금액
 */   
 function calculateProgressiveTax(amount) {
    if (amount <= 0) return 0; // 과세 표준이 0 이하이면 세금 없음

    let tax = 0;
    let previousThreshold = 0; // 이전 구간의 상한선

    // ✅ 상속세 구간별 세율 및 누진 공제
    const taxBrackets = [
        { threshold: 100000000, rate: 0.1, cumulativeTax: 0 },               // 1억 이하: 10%
        { threshold: 500000000, rate: 0.2, cumulativeTax: 10000000 },        // 5억 이하: 20% (누진공제 1천만 원)
        { threshold: 1000000000, rate: 0.3, cumulativeTax: 60000000 },       // 10억 이하: 30% (누진공제 6천만 원)
        { threshold: 3000000000, rate: 0.4, cumulativeTax: 160000000 },      // 30억 이하: 40% (누진공제 1억 6천만 원)
        { threshold: Infinity, rate: 0.5, cumulativeTax: 460000000 }        // 30억 초과: 50% (누진공제 4억 6천만 원)
    ];

    for (let bracket of taxBrackets) {
        if (amount > bracket.threshold) {
            // 현재 구간까지 해당되는 금액에 대한 세금 계산
            tax += (bracket.threshold - previousThreshold) * bracket.rate;
        } else {
            // 마지막 해당 구간에서 남은 금액에 대한 세금 계산 후 종료
            tax += (amount - previousThreshold) * bracket.rate;
            tax -= bracket.cumulativeTax; // ✅ 마지막 구간에서 누진 공제 적용
            break;
        }
        previousThreshold = bracket.threshold;
    }

    return Math.max(tax, 0); // 음수 방지
}
    
/**
 * ✅ 개인 상속 계산 함수 (배우자 추가 공제 표시 오류 수정)
 */
function calculatePersonalMode(totalAssetValue) {
    // ✅ 최신 관계 값 가져오기
   const relationshipElement = document.getElementById('relationshipPersonal');
   const minorChildAgeElement = document.getElementById('minorChildAge'); // 미성년자 나이 입력 필드 추가

if (!relationshipElement) {
    console.error("❗ 관계 선택 드롭다운을 찾을 수 없습니다.");
    return;
 }

const relationship = relationshipElement.value || 'other';
const minorChildAge = minorChildAgeElement ? parseInt(minorChildAgeElement.value) : 0; // 나이 값이 없을 경우 기본값 0

   // ✅ 기초 공제 (2억) & 관계 공제 적용
   let basicExemption = 200000000;
   let relationshipExemption = 0;

   // ✅ 관계 공제 로직 (배우자, 부모, 자녀, 형제 등)
   if (relationship === 'spouse') {
       relationshipExemption = 500000000;
   } else if (relationship === 'parent') {
       relationshipExemption = 50000000;
   } else if (relationship === 'adultChild') {
       relationshipExemption = 50000000;
   } else if (relationship === 'minorChild') {
       if (isNaN(minorChildAge) || minorChildAge < 0 || minorChildAge > 19) {
           console.error("❌ 미성년자 나이 값이 잘못되었습니다:", minorChildAge);
           minorChildAge = 0; // 잘못된 값일 경우 기본값 0으로 설정
       }
       const yearsUntilAdult = Math.max(19 - minorChildAge, 0);
       relationshipExemption = yearsUntilAdult * 10000000; // 미성년자 공제 (최대 1억 9천만 원)
   } else if (relationship === 'sibling') {
       relationshipExemption = 10000000;
   } else {
       relationshipExemption = 10000000;
   }

    // ✅ 배우자 추가 공제 (올바르게 계산)
    let spouseAdditionalExemption = 0;
    if (relationship === 'spouse') {
        let spouseInheritanceAmount = totalAssetValue; // 배우자의 실제 상속분
        spouseAdditionalExemption = Math.min((spouseInheritanceAmount - (basicExemption + relationshipExemption)) * 0.5, 3000000000); // ✅ 최대 30억 공제
    }

    // ✅ 배우자가 아닐 경우, 일괄 공제 적용 (최소 5억 보장)
    let generalExemption = 0;
    if (relationship !== 'spouse') {
        generalExemption = Math.max(500000000 - (basicExemption + relationshipExemption), 0);
    }

    // ✅ 금융재산 공제 추가 (현금 또는 주식 선택 시에만 적용, 최대 2억)
    let financialExemption = 0;
    if (assetType === 'cash' || assetType === 'stock') {
        financialExemption = Math.min(totalAssetValue * 0.2, 200000000);
    }

    // ✅ 최종 공제 계산 (총합)
    let totalExemption = basicExemption + relationshipExemption + financialExemption;
    if (relationship === 'spouse') {
        totalExemption += spouseAdditionalExemption;
    } else {
        totalExemption += generalExemption;
    }

    // ✅ 과세 표준 계산
    const taxableAmount = Math.max(totalAssetValue - totalExemption, 0);

    // ✅ 상속세 계산 (누진세율 적용)
    const tax = calculateProgressiveTax(taxableAmount);

    // ✅ 기존 결과 지우기 (중복 방지)
    document.getElementById('result').innerHTML = "";

    // ✅ 개인 상속 전용 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (개인 상속)</h3>
        <p>총 재산 금액: ${totalAssetValue.toLocaleString()} 원</p>
        <p><strong>공제 내역:</strong></p>
        <ul>
            <li>기초 공제: ${basicExemption.toLocaleString()} 원</li> 
            <li>관계 공제: ${relationshipExemption.toLocaleString()} 원 (${relationship})</li>
            ${relationship === 'spouse' ? 
                `<li>배우자 추가 공제: ${spouseAdditionalExemption.toLocaleString()} 원 (최대 30억)</li>` : 
                `<li>일괄 공제: ${generalExemption.toLocaleString()} 원</li>`}
            ${(assetType === 'cash' || assetType === 'stock') ? 
                `<li>금융재산 공제: ${financialExemption.toLocaleString()} 원</li>` : ''}
        </ul>
        <p><strong>최종 공제 금액:</strong> ${totalExemption.toLocaleString()} 원</p>
        <p>과세 표준: ${taxableAmount.toLocaleString()} 원</p>
        <p>상속세: ${tax.toLocaleString()} 원</p>
    `;
}

// ✅ 🔄 "계산하기" 버튼 클릭 시 최신 관계 값 반영!
document.getElementById('calculateButton')?.addEventListener('click', function () {
    let totalAssetValue = parseInt(document.getElementById("cashAmount")?.value.replace(/,/g, "")) || 0;
    calculatePersonalMode(totalAssetValue); // ✅ 최신 관계 값 반영하도록 수정!
});

/**
 * ✅ 전원 협의 상속 관계 공제 계산 함수 (미성년자 나이 입력 문제 해결)
 * @param {string} relationship - 상속인의 관계 (배우자, 성년 자녀, 미성년 자녀, 부모 등)
 * @param {number} age - 상속인의 나이
 * @returns {number} - 관계 공제 금액
 */
   function calculateRelationshipExemption(relationship, age) {
    if (relationship === "spouse") {
        return 500000000; // 배우자 관계 공제 (5억 원)
    } else if (relationship === "parent") {
        return 50000000; // 부모 (5천만 원)
    } else if (relationship === "adultChild") {
        return 50000000; // 성년 자녀 (5천만 원)
    } else if (relationship === "minorChild") {
        return Math.min((19 - age) * 10000000, 190000000); // 미성년 자녀 (최대 3천만 원)
    } else if (relationship === "sibling") {
        return 10000000; // 형제자매 (1천만 원)
    } else {
        return 10000000; // 기타 상속인 (1천만 원)
    }
}

/**
 * ✅ 협의 상속 계산 함수 (객체 기반으로 리팩토링)
 */
function calculateGroupMode() {
    // ✅ 상속 재산 총액 가져오기
    const totalAssetValue = parseInt(document.getElementById("cashAmount")?.value.replace(/,/g, "")) || 0;
    const heirContainer = document.querySelector('#groupSection #heirContainer');

    let totalBasicExemption = 200000000; // ✅ 기초 공제 (2억 원)
    let totalFinancialAssets = 0; // ✅ 금융 재산 총액
    let totalInheritanceTax = 0; // ✅ 최종 상속세 합계

    // ✅ 금융 재산 총액 계산 (현금 + 주식만 포함)
    document.querySelectorAll('.asset-entry').forEach(asset => {
        let assetType = asset.querySelector('.assetType')?.value;
        let assetValue = parseFloat(asset.querySelector('.assetValue')?.value.replace(/,/g, '')) || 0;
        if (assetType === 'cash' || assetType === 'stock') {
            totalFinancialAssets += assetValue;
        }
    });

    // ✅ 금융 재산 공제 (총 금융자산의 20%, 최대 2억)
    let maxFinancialExemption = Math.min(totalFinancialAssets * 0.2, 200000000);

    // ✅ 상속인 정보 가져오기 (객체 배열로 변환, 배우자 공제 이월 초기화 추가)
    let heirs = Array.from(heirContainer.querySelectorAll('.heir-entry')).map(heir => {
        const name = heir.querySelector('.heirName')?.value.trim() || '이름 없음';
        const relationship = heir.querySelector('.relationship')?.value || 'other';
        let age = 0;

        if (relationship === "minorChild") {
            const minorChildAgeInput = heir.querySelector('.minorChildAgeField');
            age = minorChildAgeInput && minorChildAgeInput.value ? parseInt(minorChildAgeInput.value) : 0;
        }

        const sharePercentage = parseFloat(heir.querySelector('.sharePercentageField')?.value || '0');
        let relationshipExemption = calculateRelationshipExemption(relationship, age);

        return { 
            name, 
            relationship, 
            age, 
            sharePercentage, 
            relationshipExemption, 
            basicExemption: (totalBasicExemption * sharePercentage) / 100,  // ✅ 기본 공제 값 추가
            spouseTransferredExemption: 0 // 🔥 배우자 공제 이월을 위한 초기화
        };
    });

// ✅ 디버깅: heirs 배열이 올바르게 생성되었는지 확인
console.log("🔍 [디버깅] 초기 상속인 데이터:", heirs);    

// ✅ 변수 선언 (초기값 0 설정) - 중복 선언 방지
let lumpSumExemption = 0;  
let maxIndividualLumpSumExemption = 0;      

// ✅ 배우자 정보 설정 (배우자 공제 후 초과분 계산)
let spouse = heirs.find(h => h.relationship === 'spouse');
let spouseExemptions = { relationshipExcess: 0, additionalExemption: 0 };

// ✅ 배우자 추가 공제 적용 (배우자 관계 공제를 초과한 금액에 대해 공제)
if (spouse) {
    let spouseInheritanceAmount = (totalAssetValue * spouse.sharePercentage) / 100;
    let spouseFinancialExemption = (maxFinancialExemption * spouse.sharePercentage) / 100;
    let spouseBasicExemption = (totalBasicExemption * spouse.sharePercentage) / 100;
    let spouseRelationshipExemption = 500000000; // 배우자 관계 공제 (5억)

    // ✅ 배우자 추가 공제 계산 초과분의 50%만 적용 (최대 30억 한도)
    let spouseExcessAmount = Math.max(spouseInheritanceAmount - spouseRelationshipExemption, 0);
    let spouseAdditionalExemption = Math.min(spouseExcessAmount * 0.5, 3000000000);
        
    // ✅ 배우자 추가 공제 적용
    spouseExemptions.additionalExemption = spouseAdditionalExemption;

   // ✅ 배우자 공제 후 초과분 계산 (이전 코드에서 if 바깥에 있어서 오류 발생 가능)
    let spouseRemainingAmount = spouseInheritanceAmount - spouseFinancialExemption - spouseBasicExemption - spouseRelationshipExemption;
    spouseRemainingAmount = Math.max(spouseRemainingAmount, 0);

    if (spouseRemainingAmount > 0 && spouse.sharePercentage < 100) {  
        spouseExemptions.additionalExemption = Math.min(spouseRemainingAmount * 0.5, 3000000000);
    }

    // 🔥 배우자가 사용하지 못한 관계 공제 이월 (최대 5억)
    let spouseExcessExemption = Math.max(spouseRelationshipExemption - spouseInheritanceAmount, 0);

    // ✅ 배우자 제외한 상속인의 총 지분 계산
    let totalNonSpouseShare = heirs.reduce((sum, heir) => {
        return heir.relationship !== "spouse" ? sum + heir.sharePercentage : sum;
    }, 0);

    // ✅ 배우자 제외한 상속인에게 이월 공제 배분
    heirs = heirs.map((heir) => {
        let spouseTransferredExemption = 0;

        if (heir.relationship !== "spouse" && totalNonSpouseShare > 0) {
            spouseTransferredExemption = (spouseExcessExemption * heir.sharePercentage) / totalNonSpouseShare;
        }

        return {
            ...heir,
            spouseTransferredExemption
        };
    });
}  // ✅ if (spouse) 블록 닫음

// ✅ 일괄 공제 (5억 한도 내에서 계산)
lumpSumExemption = Math.min(
    heirs.reduce((sum, heir) => sum + (heir.basicExemption || 0) + (heir.relationshipExemption || 0) + (heir.spouseTransferredExemption || 0), 0),
    500000000
);

// ❗️ NaN 방지
if (isNaN(lumpSumExemption) || lumpSumExemption < 0) {
    lumpSumExemption = 0;
}

// ✅ 1. 배우자 제외한 상속인의 개수 계산 (🚀 필수 추가!)
let nonSpouseHeirs = heirs.filter(h => h.relationship !== 'spouse').length;

// ✅ 1. 배우자 제외 상속인의 기초공제 및 관계공제 총합 계산
let totalNonSpouseBasicAndRelationshipExemptions = heirs.reduce((sum, heir) => {
    return heir.relationship !== "spouse" ? sum + (heir.basicExemption || 0) + (heir.relationshipExemption || 0) : sum;
}, 0);

// ✅ 3. 부족한 부분을 보정하여 "기초 공제 + 관계 공제 + 일괄 공제 보정액" 총합이 5억이 되도록 조정
let correctedLumpSumExemption = Math.max(500000000 - totalNonSpouseBasicAndRelationshipExemptions, 0);
    
// ✅ 4. 배우자 제외한 상속인의 총 지분 계산 (배우자 제외)
let totalNonSpouseShare = heirs.reduce((sum, heir) => {
    return heir.relationship !== "spouse" ? sum + heir.sharePercentage : sum;
}, 0);
   
// ✅ 5. 부족한 일괄 공제 보정액을 배우자 제외한 상속인의 지분 비율에 따라 배분
heirs = heirs.map(heir => {
    if (heir.relationship !== "spouse" && totalNonSpouseShare > 0) {
        let allocatedExemption = Math.round((correctedLumpSumExemption * heir.sharePercentage) / totalNonSpouseShare);

        // ✅ 개별 상속인의 `기초 공제 + 관계 공제 + 보정액` 합이 5억을 넘지 않도록 제한
        let maxAllowableExemption = 500000000 - ((heir.basicExemption || 0) + (heir.relationshipExemption || 0));
        allocatedExemption = Math.min(allocatedExemption, maxAllowableExemption);

        console.log(`🔍 [디버깅] 상속인: ${heir.name}`);
        console.log(`   👉 지분 비율: ${heir.sharePercentage}%`);
        console.log(`   👉 할당된 일괄 공제 보정액(allocatedExemption): ${allocatedExemption}`);
        console.log(`   👉 최대 허용 가능한 일괄 공제 보정액: ${maxAllowableExemption}`);
        return { ...heir, lumpSumExemption: allocatedExemption };
    }
    return heir;
});

// ✅ 5. 최종 일괄 공제 합산 (최대 5억 초과 방지)
lumpSumExemption = heirs.reduce((sum, heir) => sum + (heir.lumpSumExemption || 0), 0);
lumpSumExemption = Math.min(lumpSumExemption, 500000000);  

    // ✅ 6. 최종 과세 표준 계산 시 undefined 방지
heirs = heirs.map(heir => {
    let shareAmount = (totalAssetValue * heir.sharePercentage) / 100;

    // 🔥 NaN 방지
    let relationshipExemption = heir.relationshipExemption || 0;
    let basicExemption = heir.basicExemption || 0;
    let individualFinancialExemption = heir.financialExemption || 0;
    let spouseTransferredExemption = heir.spouseTransferredExemption || 0;
    let individualLumpSumExemption = heir.lumpSumExemption || 0;

    let finalTaxableAmount = Math.max(0, Math.round(
        shareAmount - relationshipExemption - basicExemption - individualFinancialExemption - spouseTransferredExemption - individualLumpSumExemption
    ));

    console.log(`🔍 [디버깅] 최종 과세 표준 계산 - ${heir.name}`);
    console.log(`   👉 상속 금액: ${shareAmount}`);
    console.log(`   👉 일괄 공제 보정액: ${individualLumpSumExemption}`);
    console.log(`   👉 최종 과세 표준: ${finalTaxableAmount}`);
    
    return { ...heir, finalTaxableAmount };
});

// ✅ 최종 heirs 배열 확인
console.log("📌 [디버깅] 최종 heirs 배열 확인:", JSON.stringify(heirs, null, 2));
    
// ✅ 7. 최종 일괄 공제 보정액이 5억을 초과하지 않는지 확인
let finalLumpSumExemptionTotal = heirs.reduce((sum, heir) => sum + (heir.lumpSumExemption || 0), 0);
console.log("📌 최종 일괄 공제 보정액 총합 (5억 초과 방지):", finalLumpSumExemptionTotal);
 
// ✅ 추가 디버깅 로그
console.log("📌 계산된 correctedLumpSumExemption 값:", correctedLumpSumExemption);
console.log("📌 계산된 배우자 제외한 상속인의 기초 공제 + 관계 공제 총합:", totalNonSpouseBasicAndRelationshipExemptions);
console.log("📌 최종 일괄 공제 보정액 총합 (5억 초과 방지):", finalLumpSumExemptionTotal);  
    
heirs.forEach((heir) => {
    console.log(`🔍 상속인: ${heir.name} (${heir.relationship})`);
    console.log(`   👉 지분 비율: ${heir.sharePercentage}`);
    console.log(`   👉 개별 기초 공제 (basicExemption):`, heir.basicExemption);
    console.log(`   👉 개별 관계 공제 (relationshipExemption):`, heir.relationshipExemption);
    console.log(`   👉 개별 금융재산 공제 (financialExemption):`, heir.financialExemption);
    console.log(`   👉 배우자 공제 이월 (spouseTransferredExemption):`, heir.spouseTransferredExemption);
    console.log(`   👉 개별 일괄 공제 보정액 (lumpSumExemption):`, heir.lumpSumExemption);
    console.log(`   👉 최종 과세 표준 (finalTaxableAmount):`, heir.finalTaxableAmount);
    console.log(`   👉 개별 상속세 (individualTax):`, heir.individualTax);
});
    
// ✅ 확인 로그 추가 (일괄 공제 보정값이 5억이 되는지 확인)
console.log("📌 보정된 일괄 공제 총합:", correctedLumpSumExemption); 

 // ✅ 배우자 관련 변수를 먼저 선언하여 어디서든 접근 가능하도록 수정
let spouseInheritanceAmount = 0;
let spouseFinancialExemption = 0;
let spouseBasicExemption = 0;
let spouseRelationshipExemption = 500000000; // 배우자 관계 공제 (5억)

// ✅ 배우자가 있을 경우, 실제 상속 금액 계산
if (spouse) {
    spouseInheritanceAmount = (totalAssetValue * spouse.sharePercentage) / 100;
    spouseFinancialExemption = (maxFinancialExemption * spouse.sharePercentage) / 100;
    spouseBasicExemption = (totalBasicExemption * spouse.sharePercentage) / 100;

    let spouseExcessAmount = Math.max(spouseInheritanceAmount - spouseRelationshipExemption, 0);
    let spouseAdditionalExemption = Math.min(spouseExcessAmount * 0.5, 3000000000);

    spouseExemptions.additionalExemption = spouseAdditionalExemption;

    let spouseRemainingAmount = spouseInheritanceAmount - spouseFinancialExemption - spouseBasicExemption - spouseRelationshipExemption;
    spouseRemainingAmount = Math.max(spouseRemainingAmount, 0);

    if (spouseRemainingAmount > 0 && spouse.sharePercentage < 100) {
        spouseExemptions.additionalExemption = Math.min(spouseRemainingAmount * 0.5, 3000000000);
    }
}

// ✅ 배우자의 과세 표준을 올바르게 계산 (한 번만 계산하고 저장)
let spouseFinalTaxableAmount = spouseInheritanceAmount  
                               - spouseFinancialExemption 
                               - spouseBasicExemption 
                               - spouseRelationshipExemption 
                               - spouseExemptions.additionalExemption;

// ✅ 과세표준이 음수가 되지 않도록 최소값 0으로 보정
spouseFinalTaxableAmount = Math.max(spouseFinalTaxableAmount, 0);
    
// ✅ 개별 상속인 데이터 가공
let processedHeirs = heirs?.map((heir) => {
   console.log(`📌 처리 중: ${heir.name} (${heir.relationship})`);

    const shareAmount = (totalAssetValue * heir.sharePercentage) / 100;    
   
     // 🔥 undefined 방지: 기본 값 설정 / 관계 공제, 기초 공제 초기화
    let relationshipExemption = heir.relationshipExemption || 0;
    let basicExemption = heir.basicExemption ?? (totalBasicExemption * heir.sharePercentage) / 100;
    let spouseTransferredExemption = heir.spouseTransferredExemption || 0;
    let individualLumpSumExemption = (heir.relationship !== 'spouse') ? (lumpSumExemption * heir.sharePercentage) / 100 : 0;

     // ✅ 금융 재산 공제 (undefined 방지)
    let individualFinancialExemption = heir.sharePercentage 
        ? Math.round((maxFinancialExemption * heir.sharePercentage) / 100) 
        : 0;
    
   // 🔥 undefined 값이 있는 경우 0으로 초기화
    relationshipExemption = relationshipExemption || 0;
    basicExemption = basicExemption || 0;
    individualFinancialExemption = individualFinancialExemption || 0;
    spouseTransferredExemption = spouseTransferredExemption || 0;
    individualLumpSumExemption = individualLumpSumExemption || 0;

    // ✅ 소수점 처리 (반올림 적용)
    spouseTransferredExemption = Math.round(spouseTransferredExemption);
    individualLumpSumExemption = Math.round(individualLumpSumExemption);
    individualFinancialExemption = Math.round(individualFinancialExemption);
    basicExemption = Math.round(basicExemption);
    relationshipExemption = Math.round(relationshipExemption);
    
    // ✅ 최종 과세 표준 계산
    let finalTaxableAmount = Math.max(0, Math.round(
        shareAmount - relationshipExemption - basicExemption - individualFinancialExemption - spouseTransferredExemption - individualLumpSumExemption
    ));
    
    // ✅ 배우자일 경우 미리 계산된 과세표준 적용
    if (heir.relationship === "spouse") {
        finalTaxableAmount = spouseFinalTaxableAmount;
    }
   
    // ✅ 개별 상속세 계산
    const individualTax = (finalTaxableAmount > 0) ? calculateInheritanceTax(finalTaxableAmount) : 0;
    totalInheritanceTax += individualTax;

    // ✅ 디버깅 로그
    console.log("   ✅ 처리 후 - 개별 금융재산 공제 (financialExemption):", individualFinancialExemption);
    console.log("   ✅ 처리 후 - 배우자 공제 이월 (spouseTransferredExemption):", spouseTransferredExemption);
    console.log("   ✅ 처리 후 - 개별 일괄 공제 보정액 (lumpSumExemption):", individualLumpSumExemption);
    console.log("   ✅ 처리 후 - 최종 과세 표준 (finalTaxableAmount):", finalTaxableAmount);
    console.log("   ✅ 처리 후 - 개별 상속세 (individualTax):", individualTax);

    return {
        ...heir,
        shareAmount,
        basicExemption,
        financialExemption: individualFinancialExemption,
        lumpSumExemption: individualLumpSumExemption,
        spouseTransferredExemption,  // 🔥 반올림 적용된 값 저장
        finalTaxableAmount,  // 🔥 반올림 적용된 값 저장
        individualTax
    };
}) || [];

// ✅ 총 일괄 공제 계산 (기초공제 + 관계공제 + 개별 일괄 공제 보정액의 합이 5억을 넘으면 5억으로 제한)
lumpSumExemption = Math.min(processedHeirs.reduce((sum, heir) => {
    return sum + heir.basicExemption + heir.relationshipExemption + heir.lumpSumExemption;
}, 0), 500000000);

// ❗️ NaN 방지
if (isNaN(lumpSumExemption) || lumpSumExemption < 0) {
    lumpSumExemption = 0;
}

// ✅ 최종 결과 출력 (디버깅용)
console.log(`최종 상속세 합계: ${totalInheritanceTax.toLocaleString()} 원`);

// ✅ 최종 결과 출력 (객체 배열을 활용한 동적 HTML 생성)
document.getElementById('result').innerHTML = `
    <h3>총 상속 금액: ${totalAssetValue.toLocaleString()} 원</h3>
    ${maxFinancialExemption > 0 ? `<h3>금융재산 공제: ${maxFinancialExemption.toLocaleString()} 원</h3>` : ""}
    <h3>기초 공제: ${totalBasicExemption.toLocaleString()} 원</h3>
    ${spouse ? `<h3>배우자 관계공제: 500,000,000 원</h3>` : ""}
    <h3>일괄 공제: ${lumpSumExemption.toLocaleString()} 원</h3>

    ${processedHeirs.map((heir) => `
        <h4>${heir.name} (${heir.sharePercentage.toFixed(2)}% 지분)</h4>
        <p>상속 금액: ${Math.round(heir.shareAmount).toLocaleString()} 원</p>
        ${heir.financialExemption > 0 ? `<p>금융재산 공제: ${Math.round(heir.financialExemption).toLocaleString()} 원</p>` : ""}
        <p>기초 공제: ${Math.round(heir.basicExemption).toLocaleString()} 원</p>
        <p>관계 공제: ${Math.round(heir.relationshipExemption).toLocaleString()} 원</p>
        ${(heir.spouseTransferredExemption > 0) ? `<p>배우자 공제 이월: ${Math.round(heir.spouseTransferredExemption).toLocaleString()} 원</p>` : ""}
        ${(heir.relationship === "spouse" && spouseExemptions.additionalExemption > 0) ? `<p>배우자 추가 공제: ${Math.round(spouseExemptions.additionalExemption).toLocaleString()} 원</p>` : ""}
        ${heir.lumpSumExemption > 0 ? `<p>일괄 공제 보정액: ${Math.round(heir.lumpSumExemption).toLocaleString()} 원</p>` : ""}
        <p>과세 표준: ${Math.round(heir.finalTaxableAmount).toLocaleString()} 원</p>
        <p>개별 상속세: ${Math.round(heir.individualTax).toLocaleString()} 원</p>
        <hr>
    `).join("")}  

    <h3>최종 상속세 합계: ${Math.round(totalInheritanceTax).toLocaleString()} 원</h3>
`;
}
          
 /**                  
 * ✅ 법정 상속 계산 함수 (민법에 따른 법정 상속 비율 자동 적용)
 * @description 법정 상속 방식으로 상속인의 법정 지분을 자동 계산하고, 
 * 상속세 및 관계 공제를 적용하여 최종 과세 표준과 상속세를 산출합니다.
 * @returns {void} - 결과를 화면에 출력
 */
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
    // ✅ 공용 상속세율 계산 함수 (누진세율 적용)
function calculateInheritanceTax(taxableAmount) {
    if (taxableAmount <= 100000000) {
        return Math.round(taxableAmount * 0.10);
    } else if (taxableAmount <= 500000000) {
        return Math.round(taxableAmount * 0.20 - 10000000);
    } else if (taxableAmount <= 1000000000) {
        return Math.round(taxableAmount * 0.30 - 60000000);
    } else if (taxableAmount <= 3000000000) {
        return Math.round(taxableAmount * 0.40 - 160000000);
    } else {
        return Math.round(taxableAmount * 0.50 - 460000000);
    }
}

// ✅ [법정 상속] 계산 함수
function calculateLegalInheritance() {
    // ✅ 입력된 재산 값 가져오기 (쉼표 제거 후 숫자로 변환)
    let cashValue = parseInt(document.getElementById("cashAmount")?.value.replace(/,/g, "")) || 0;
    let stockValue = parseInt(document.getElementById("stockTotal")?.value.replace(/,/g, "")) || 0;
    let realEstateValue = parseInt(document.getElementById("realEstateValue")?.value.replace(/,/g, "")) || 0;
    let othersValue = parseInt(document.getElementById("othersValue")?.value.replace(/,/g, "")) || 0;

    // ✅ 총 상속 재산 계산
    let totalAssetValue = cashValue + stockValue + realEstateValue + othersValue;

    // ✅ 금융재산 공제 (현금 + 주식 20% 공제, 최대 2억 원)
    let totalFinancialExemption = Math.min((cashValue + stockValue) * 0.2, 200000000);

    // ✅ 상속세 총합 변수 초기화
    let totalInheritanceTax = 0;
    let individualResults = [];

    // ✅ 상속인 목록을 배열로 변환 (NodeList → Array)
    let heirs = Array.from(document.querySelectorAll("#legalHeirContainer .heir-entry"));

    // ✅ heirs 배열이 비어 있는 경우 기본값을 설정하여 오류 방지
    if (heirs.length === 0) {
        console.warn("❗ heirs 배열이 비어 있습니다. 상속인 목록을 확인하세요.");
    }

   // ✅ 배우자 존재 여부 및 상속인 유형별 수 확인
   let spouseExists = false;
   let numChildren = 0, numParents = 0, numSiblings = 0, numOthers = 0;

   heirs.forEach(heir => {
       let relationship = heir.querySelector(".relationship")?.value;
       if (relationship === "spouse") {
           spouseExists = true;  // ✅ 배우자가 존재하면 true로 설정
       } else if (relationship === "adultChild" || relationship === "minorChild") {
           numChildren++;
       } else if (relationship === "parent") {
           numParents++;
       } else if (relationship === "sibling") {
           numSiblings++;
       } else {
           numOthers++;
       }
   });
   
    // ✅ 법정 상속 비율 계산
    let totalInheritance = (spouseExists ? 1.5 : 0) + numChildren + numParents + numSiblings + numOthers;
    let spouseShare = spouseExists ? (1.5 / totalInheritance) : 0;
    let childShare = numChildren > 0 ? (1 / totalInheritance) : 0;
    let parentShare = numParents > 0 ? (1 / totalInheritance) : 0;
    let siblingShare = numSiblings > 0 ? (1 / totalInheritance) : 0;
    let otherShare = numOthers > 0 ? (1 / totalInheritance) : 0;
  
    // ✅ 금융재산 공제 **상속 지분에 따라 배분**
    let spouseFinancialExemption = Math.round(spouseShare * totalFinancialExemption);
    let childFinancialExemption = numChildren > 0 ? Math.round(childShare * totalFinancialExemption) : 0;
    let parentFinancialExemption = numParents > 0 ? Math.round(parentShare * totalFinancialExemption) : 0;
    let siblingFinancialExemption = numSiblings > 0 ? Math.round(siblingShare * totalFinancialExemption) : 0;
    let otherFinancialExemption = numOthers > 0 ? Math.round(otherShare * totalFinancialExemption) : 0;

    // ✅ 기초공제 (2억 원) 추가 및 배분
    let totalBasicExemption = 200000000;
    let spouseBasicExemption = spouseExists ? Math.round(spouseShare * totalBasicExemption) : 0;
    let childBasicExemption = numChildren > 0 ? Math.round(childShare * totalBasicExemption) : 0;
    let parentBasicExemption = numParents > 0 ? Math.round(parentShare * totalBasicExemption) : 0;
    let siblingBasicExemption = numSiblings > 0 ? Math.round(siblingShare * totalBasicExemption) : 0;
    let otherBasicExemption = numOthers > 0 ? Math.round(otherShare * totalBasicExemption) : 0;
  
    // ✅ 배우자 상속 금액 계산 (배우자 지분 적용)
    let spouseInheritanceAmount = Math.round(totalAssetValue * spouseShare);

    // ✅ 배우자 기초 공제 계산 (배우자 지분에 따른 비율 적용)
    spouseBasicExemption = Math.round(spouseShare * 200000000);

    // ✅ 배우자 추가 공제 계산 (소수점 없는 정수 값으로 반올림)
    let spouseAdditionalExemption = spouseExists 
        ? Math.min(Math.round((spouseInheritanceAmount - spouseBasicExemption - 500000000) * 0.5), 3000000000) 
        : 0;

    // ✅ 최종 배우자 추가 공제 값 로그 확인 (소수점 없는 정수 값 출력)
    console.log("📌 배우자 추가 공제:", spouseAdditionalExemption.toLocaleString(), "원");

    // ✅ 배우자 제외한 상속인의 기초공제 + 관계공제 합계
    let totalNonSpouseExemptions = heirs.reduce((sum, heir) => {
        let relationship = heir.querySelector(".relationship")?.value;
        if (relationship !== "spouse") {
            let individualBasicExemption = parseInt(heir.dataset.basicExemption) || 0;
            let individualRelationshipExemption = parseInt(heir.dataset.relationshipExemption) || 0;
            return sum + individualBasicExemption + individualRelationshipExemption;
        }
        return sum;
    }, 0);

    // ✅ 일괄공제 적용 여부 판단 (배우자 제외 기초공제 + 관계공제 합이 5억 이하일 때만 적용)
    let lumpSumExemption = (totalNonSpouseExemptions < 500000000)
        ? 500000000 - totalNonSpouseExemptions
        : 0;

    // ✅ 배우자 제외한 상속인 수 (0 이하 방지)
    let nonSpouseHeirs = Math.max(heirs.length - (spouseExists ? 1 : 0), 1);

    // ✅ 배우자 제외 상속인의 1인당 최대 배분 가능 일괄공제 금액
    let maxIndividualLumpSumExemption = Math.round(lumpSumExemption / nonSpouseHeirs);

    // ✅ 상단 결과지에 "일괄공제" 값 표시 (5억이 아니라 실제 계산된 값 반영)
    let displayLumpSumExemption = (totalNonSpouseExemptions < 500000000) 
        ? 500000000  
        : totalNonSpouseExemptions;

   // ✅ 개별 상속인별 과세 표준 및 상속세 계산
heirs.forEach(heir => {
    let name = heir.querySelector(".heirName")?.value || "상속인";
    let relationship = heir.querySelector(".relationship")?.value;
    let minorChildAge = heir.querySelector(".minorChildAgeField")?.value || "0";
    minorChildAge = parseInt(minorChildAge) || 0; // 🔹 NaN 방지

    let share = (relationship === "spouse") ? spouseShare : 
                (relationship === "adultChild" || relationship === "minorChild") ? childShare : 
                (relationship === "parent") ? parentShare : 
                (relationship === "sibling") ? siblingShare : 
                (relationship === "other") ? otherShare : 0;
    
    let inheritanceAmount = Math.round(totalAssetValue * share);

    let individualFinancialExemption = (relationship === "spouse") ? spouseFinancialExemption :
                                       (relationship === "adultChild" || relationship === "minorChild") ? childFinancialExemption :
                                       (relationship === "parent") ? parentFinancialExemption :
                                       (relationship === "sibling") ? siblingFinancialExemption :
                                       (relationship === "other") ? otherFinancialExemption : 0;
    let individualBasicExemption = (relationship === "spouse") ? spouseBasicExemption :
                                   (relationship === "adultChild" || relationship === "minorChild") ? childBasicExemption :
                                   (relationship === "parent") ? parentBasicExemption :
                                   (relationship === "sibling") ? siblingBasicExemption :
                                   (relationship === "other") ? otherBasicExemption : 0;

    // ✅ 관계 공제 (배우자 5억, 부모 5천만, 성년 자녀 5천만, 미성년 자녀 연령에 따라 계산, 형제 1천만, 기타 1천만)
    let individualRelationshipExemption = 0;
    if (relationship === "spouse") {
        individualRelationshipExemption = 500000000; // 배우자 (5억)
    } else if (relationship === "parent") {
        individualRelationshipExemption = 50000000; // 부모 (5천만)
    } else if (relationship === "adultChild") {
        individualRelationshipExemption = 50000000; // 성년 자녀 (5천만)
    } else if (relationship === "minorChild") {
        individualRelationshipExemption = Math.min((19 - minorChildAge) * 10000000, 30000000); // 미성년 자녀 (최대 3천만)
    } else if (relationship === "sibling") {
        individualRelationshipExemption = 10000000; // 형제자매 (1천만)
    } else {
        individualRelationshipExemption = 10000000; // 기타 상속인 (1천만)
    }

    // ✅ 개별 상속인의 기초공제 + 관계공제 합산
    let totalIndividualExemption = individualBasicExemption + individualRelationshipExemption;

    // ✅ 개별 일괄공제 보정 적용 (5억 미만일 때만 적용, 5억 이상이면 0)
    let individualLumpSumExemption = (totalNonSpouseExemptions < 500000000)
        ? Math.max(0, maxIndividualLumpSumExemption - totalIndividualExemption)
        : 0;

    // ✅ 배우자 추가 공제는 배우자에게만 적용되도록 수정
    let individualSpouseAdditionalExemption = (relationship === "spouse") ? spouseAdditionalExemption : 0;

    // ✅ 개별 상속인의 과세 표준 계산
    let individualTaxableAmount = Math.max(
        inheritanceAmount - individualFinancialExemption - individualBasicExemption - individualRelationshipExemption - individualLumpSumExemption - individualSpouseAdditionalExemption,
        0
    );

    // ✅ 개별 상속세 계산
    let individualTax = calculateInheritanceTax(individualTaxableAmount);
    totalInheritanceTax += individualTax;

    // ✅ 개별 상속인 결과 반영
    individualResults.push(`
        <h4>${name} (${(share * 100).toFixed(2)}% 지분)</h4>
        <p>상속 금액: ${inheritanceAmount.toLocaleString()} 원</p>
        ${individualFinancialExemption > 0 ? `<p>금융재산 공제: ${individualFinancialExemption.toLocaleString()} 원</p>` : ""}
        <p>기초 공제: ${individualBasicExemption.toLocaleString()} 원</p>
        <p>관계 공제: ${individualRelationshipExemption.toLocaleString()} 원</p>
        ${relationship === "spouse" ? `<p>배우자 추가 공제: ${individualSpouseAdditionalExemption.toLocaleString()} 원</p>` : ""}
        ${relationship !== "spouse" ? `<p>일괄 공제 보정액: ${individualLumpSumExemption.toLocaleString()} 원</p>` : ""}
        <p>과세 표준: ${individualTaxableAmount.toLocaleString()} 원</p>
        <p>개별 상속세: ${individualTax.toLocaleString()} 원</p>
        <hr>
    `);
});
   
// ✅ 최종 결과 출력
document.getElementById('result').innerHTML = `
    <h3>총 상속 금액: ${totalAssetValue.toLocaleString()} 원</h3>
    ${totalFinancialExemption > 0 ? `<h3>금융재산 공제: ${totalFinancialExemption.toLocaleString()} 원</h3>` : ""}
    <h3>기초 공제: ${totalBasicExemption.toLocaleString()} 원</h3>
    ${spouseExists ? `<h3>배우자 관계공제: 500,000,000 원</h3>` : ""}
    ${spouseExists ? `<h3>배우자 추가 공제: ${spouseAdditionalExemption.toLocaleString()} 원</h3>` : ""}
    <h3>일괄 공제: ${displayLumpSumExemption.toLocaleString()} 원</h3> 
    ${individualResults.join("")}
    <h3>최종 상속세 합계: ${totalInheritanceTax.toLocaleString()} 원</h3>  
 `;
}

// ✅ 계산 버튼 클릭 시 실행
document.getElementById('calculateButton').addEventListener('click', calculateLegalInheritance);

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
