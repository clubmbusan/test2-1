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

// 초기화 호출
initializeDefaultView();
    
   // 자산 유형 변경 처리
    function handleAssetTypeChange(assetTypeSelect) {
        const assetEntry = assetTypeSelect.closest('.asset-entry');
        if (!assetEntry) {
            console.error('assetTypeSelect의 상위 .asset-entry 요소를 찾을 수 없습니다.');
            return; // 더 이상 진행하지 않음
        }

        const assetFields = assetEntry.querySelector('.assetFields');
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

// 모든 assetType에 이벤트 리스너 추가
document.querySelectorAll('.assetType').forEach(select => {
    select.addEventListener('change', () => handleAssetTypeChange(select));
});

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
            <input type="text" placeholder="이름">
            <select>
                <option value="spouse">배우자</option>
                <option value="adultChild">자녀(성년)</option>
                <option value="minorChild">자녀(미성년)</option>
                <option value="parent">부모</option>
                <option value="sibling">형제자매</option>
                <option value="other">기타</option>
            </select>
            <input type="number" class="sharePercentageField" placeholder="상속 비율 (%)">
        `;

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
    const newHeirEntry = document.createElement('div');
    newHeirEntry.className = 'heir-entry';
    newHeirEntry.innerHTML = `
        <input type="text" placeholder="이름">
        <select>
            <option value="spouse">배우자</option>
            <option value="adultChild">성년 자녀</option>
            <option value="minorChild">미성년 자녀</option>
            <option value="parent">부모</option>
            <option value="sibling">형제자매</option>
            <option value="other">기타</option>
        </select>
        <input type="text" class="sharePercentage" placeholder="상속 비율 (%)">
    `;
    businessGroupHeirContainer.appendChild(newHeirEntry);
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
    assetContainer.appendChild(newAsset);

    const assetTypeSelect = newAsset.querySelector('.assetType');
    assetTypeSelect.addEventListener('change', () => handleAssetTypeChange(assetTypeSelect));
}

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

    // 공제 계산 로직 ---- 상속세 계산 로직에 기초공제를 추가
function calculateExemptions(totalInheritance, relationship, spouseShare = 0) {
    const basicExemption = 600000000; // 기본 공제 (6억 원)
    const baseExemption = 200000000; // 기초 공제 (2억 원)

    let relationshipExemption = 0;

    switch (relationship) {
        case 'spouse':
            relationshipExemption = Math.min(spouseShare, totalInheritance * 0.5, 3500000000); // 배우자 공제
            break;
        case 'adultChild':
            relationshipExemption = 500000000; // 성년 자녀 공제
            break;
        case 'minorChild':
            relationshipExemption = 30000000; // 미성년 자녀 공제
            break;
        case 'parent':
            relationshipExemption = 100000000; // 부모 공제
            break;
        case 'sibling':
        case 'other':
            relationshipExemption = 10000000; // 기타 공제
            break;
        default:
            console.error('잘못된 관계 선택:', relationship);
            return { basicExemption, baseExemption, relationshipExemption: 0, totalExemption: 0 };
    }

    const totalExemption = basicExemption + baseExemption + relationshipExemption;

    return { basicExemption, baseExemption, relationshipExemption, totalExemption };
}

// 과세표준 계산 함수
function calculateTaxableAmount(totalInheritance, exemptions) {
    return Math.max(totalInheritance - exemptions.totalExemption, 0); // 음수일 경우 0 처리
}

// 누진세율 적용 함수
function calculateTax(taxableAmount) {
    
    const taxBrackets = [
        { limit: 200000000, rate: 0.1 }, // 2억 이하
        { limit: 500000000, rate: 0.2 }, // 5억 이하
        { limit: 1000000000, rate: 0.3 }, // 10억 이하
        { limit: Infinity, rate: 0.4 }, // 10억 초과
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

    return Math.max(tax, 0);
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
    
// 개인 상속 로직
function calculatePersonalMode(totalAssetValue) {
    const relationship = document.getElementById('relationshipPersonal')?.value || 'other';
    const spouseShare = totalAssetValue;

    // 공제 계산
    const { totalExemption, relationshipExemption } = calculateExemptions(totalAssetValue, relationship, spouseShare);

    // 과세표준 계산
    const taxableAmount = Math.max(totalAssetValue - totalExemption, 0);

    // 상속세 계산
    const tax = calculateTax(taxableAmount);

    // 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (개인 상속)</h3>
        <p>총 재산 금액: ${totalAssetValue.toLocaleString()} 원</p>
        <p><strong>공제 내역:</strong></p>
        <ul>
            <li>기본 공제: 600,000,000 원</li>
            <li>기초 공제: 200,000,000 원</li>
            <li>관계 공제: ${relationshipExemption.toLocaleString()} 원 (${relationship})</li>
        </ul>
        <p><strong>총 공제 금액:</strong> ${totalExemption.toLocaleString()} 원</p>
        <p>과세 금액: ${taxableAmount.toLocaleString()} 원</p>
        <p>상속세: ${tax.toLocaleString()} 원</p>
    `;
}

// 총 공제를 상세히 계산하는 함수
function calculateTotalExemptionDetailed(shareAmount, relationship, spouseShare = 0) {
    const exemptions = calculateExemptions(shareAmount, relationship, spouseShare);
    return exemptions;
}

// 단체 상속 계산 함수
function calculateGroupMode(totalAssetValue) {
    const heirs = Array.from(document.querySelectorAll('.heir-entry')).map((heir) => {
        const name = heir.querySelector('input[type="text"]').value || '상속인';
        const relationship = heir.querySelector('select')?.value || 'other';
        const sharePercentage = parseFloat(heir.querySelector('input[type="number"]').value || '0');

        if (sharePercentage <= 0 || isNaN(sharePercentage)) {
            console.error(`${name}의 상속 비율이 올바르지 않습니다.`);
            return null; // 잘못된 항목 제외
        }

        const shareAmount = (totalAssetValue * sharePercentage) / 100;
        const { totalExemption, basicExemption, baseExemption, relationshipExemption } =
            calculateExemptions(shareAmount, relationship, shareAmount);
        const taxableAmount = Math.max(shareAmount - totalExemption, 0);
        const tax = calculateTax(taxableAmount);

        return {
            name,
            shareAmount,
            exemptions: { basicExemption, baseExemption, relationshipExemption, totalExemption },
            taxableAmount,
            tax,
        };
     }).filter(Boolean); // 잘못된 항목 제거
    
    // 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (전체 상속)</h3>
        ${heirs.map(
            (heir) => `
            <p>
                <strong>${heir.name}</strong>: ${heir.shareAmount.toLocaleString()} 원<br>
                공제 내역:<br>
                - 기본 공제: ${heir.exemptions.basicExemption.toLocaleString()} 원<br>
                - 기초 공제: ${heir.exemptions.baseExemption.toLocaleString()} 원<br>
                - 관계 공제: ${heir.exemptions.relationshipExemption.toLocaleString()} 원<br>
                총 공제 금액: ${heir.exemptions.totalExemption.toLocaleString()} 원<br>
                과세 금액: ${heir.taxableAmount.toLocaleString()} 원<br>
                상속세: ${heir.tax.toLocaleString()} 원
            </p>
        `).join('')}
    `;
}

  // 가업 개인 상속 계산 함수
function calculateBusinessPersonalMode(totalAssetValue) {
    const heirType = document.getElementById('businessHeirTypePersonal').value;
    let exemption = 6000000000; // 기본 공제 (60억 원)

    if (heirType === 'minor') {
        exemption += 30000000; // 미성년 후계자 공제
    } else if (heirType === 'other') {
        exemption = 0; // 기타 후계자는 공제 없음
    }

    const taxableAmount = Math.max(totalAssetValue - exemption, 0);
    const tax = calculateTax(taxableAmount);

    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (가업 개인 상속)</h3>
        <p>총 재산 금액: ${formatNumberWithCommas(totalAssetValue.toString())} 원</p>
        <p>공제 금액: ${formatNumberWithCommas(exemption.toString())} 원</p>
        <p>과세 금액: ${formatNumberWithCommas(taxableAmount.toString())} 원</p>
        <p>상속세: ${formatNumberWithCommas(tax.toString())} 원</p>
    `;
}

// 가업 단체 상속 계산 함수
function calculateBusinessGroupMode(totalAssetValue) {
    const heirs = Array.from(document.querySelectorAll('.heir-entry')).map((heir, index) => {
        const name = heir.querySelector('input[type="text"]').value || `상속인 ${index + 1}`;
        const relationship = heir.querySelector('select').value || "기타";
        const shareField = heir.querySelector('input[type="number"]');
        const share = parseFloat(shareField.value) || 0;

        if (!shareField.value || share === 0) {
            alert(`${name}의 상속 비율이 입력되지 않았습니다. 비율을 입력 후 다시 시도해주세요.`);
            throw new Error("상속 비율 누락");
        }

        const heirAssetValue = (totalAssetValue * share) / 100;

        // 가업 공제 계산
        let businessExemption = 0;
        if (relationship === 'spouse') {
            businessExemption = Math.min(heirAssetValue, 3000000000); // 배우자: 최대 30억
        } else if (relationship === 'adultChild') {
            businessExemption = Math.min(heirAssetValue * 0.5, 2000000000); // 성년 자녀: 최대 20억
        } else if (relationship === 'minorChild') {
            businessExemption = heirAssetValue * 0.6; // 미성년 자녀: 60% 공제
        } else {
            businessExemption = heirAssetValue * 0.3; // 기타: 30% 공제
        }

        const taxableAmount = Math.max(heirAssetValue - businessExemption, 0);
        const tax = calculateTax(taxableAmount);

        return { name, share, assetValue: heirAssetValue, businessExemption, taxableAmount, tax };
    });

    // 결과 출력
    const totalInheritedAssets = heirs.reduce((sum, heir) => sum + heir.assetValue, 0);

    document.getElementById('result').innerHTML = `
        <h3>계산 결과 (가업 단체 상속)</h3>
        <p><strong>상속 재산 합계:</strong> ${formatNumberWithCommas(totalInheritedAssets.toString())} 원</p>
        ${heirs.map(heir => `
            <p>
                <strong>${heir.name}</strong>: ${heir.assetValue.toLocaleString()} 원<br>
                가업 공제 금액: ${heir.businessExemption.toLocaleString()} 원<br>
                과세 금액: ${heir.taxableAmount.toLocaleString()} 원<br>
                상속세: ${heir.tax.toLocaleString()} 원
            </p>
        `).join('')}
    `;
}

// 6. 계산 버튼 이벤트 (하단 배치)
    calculateButton.addEventListener('click', () => {
        const totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
            const value = parseInt(field.value.replace(/,/g, '') || '0', 10);
            return sum + value;
        }, 0);

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
