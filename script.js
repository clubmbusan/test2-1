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

    initializeDefaultView(); // 초기화 호출

    // 상속 유형 변경 시
    inheritanceType.addEventListener('change', () => {
        resetSections(); // 모든 섹션 숨김

        switch (inheritanceType.value) {
            case 'personal':
                personalSection.style.display = 'block'; // 개인 상속 섹션 표시
                break;
            case 'group':
                groupSection.style.display = 'block'; // 전체 상속 섹션 표시
                break;
            case 'businessPersonal':
                businessPersonalSection.style.display = 'block'; // 가업 개인 상속 섹션 표시
                break;
            case 'businessGroup':
                businessGroupSection.style.display = 'block'; // 가업 단체 상속 섹션 표시
                break;
            default:
                console.error('잘못된 상속 유형 선택');
                break;
        }
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
            <input type="number" placeholder="상속 비율 (%)">
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

    // 상속세 계산 함수 (누진세율 적용)
    function calculateTax(taxableAmount) {
        const taxBrackets = [
            { limit: 1000000000, rate: 0.1, deduction: 0 },
            { limit: 5000000000, rate: 0.2, deduction: 10000000 },
            { limit: 10000000000, rate: 0.3, deduction: 60000000 },
            { limit: 30000000000, rate: 0.4, deduction: 160000000 },
            { limit: Infinity, rate: 0.5, deduction: 460000000 },
        ];

        for (const bracket of taxBrackets) {
            if (taxableAmount <= bracket.limit) {
                return Math.max((taxableAmount * bracket.rate) - bracket.deduction, 0);
            }
        }
        return 0;
    }

    // 공제 계산
    function calculateExemption(relationship, assetValue) {
        let exemption = 600000000;

        switch (relationship) {
            case 'spouse':
                exemption += 3500000000;
                break;
            case 'minorChild':
                exemption += 30000000;
                break;
            case 'adultChild':
                exemption += 50000000;
                break;
            case 'parent':
                exemption += 50000000;
                break;
            case 'sibling':
                exemption += 10000000;
                break;
            case 'other':
                exemption += 10000000;
                break;
        }

        return Math.min(exemption, assetValue);
    }

    // 계산 버튼 이벤트
    calculateButton.addEventListener('click', () => {
        const totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
            const value = parseInt(field.value.replace(/,/g, '') || '0', 10);
            return sum + value;
        }, 0);

        switch (inheritanceType.value) {
            case 'personal':
                calculatePersonalMode(totalAssetValue);
                break;
            case 'group':
                calculateGroupMode(totalAssetValue);
                break;
            case 'businessPersonal':
                calculateBusinessPersonalMode(totalAssetValue);
                break;
            case 'businessGroup':
                calculateBusinessGroupMode(totalAssetValue);
                break;
            default:
                console.error('잘못된 계산 요청');
                break;
        }
    });

    // 개인 상속 계산
   function calculatePersonalMode(totalAssetValue) {
        const relationship = document.getElementById('relationshipPersonal').value;
        const exemption = calculateExemption(relationship, totalAssetValue);
        const taxableAmount = Math.max(totalAssetValue - exemption, 0);
        const tax = calculateTax(taxableAmount);

        result.innerHTML = `
            <h3>계산 결과 (개인 상속)</h3>
            <p>총 재산 금액: ${formatNumberWithCommas(totalAssetValue.toString())} 원</p>
            <p>공제 금액: ${formatNumberWithCommas(exemption.toString())} 원</p>
            <p>과세 금액: ${formatNumberWithCommas(taxableAmount.toString())} 원</p>
            <p>상속세: ${formatNumberWithCommas(tax.toString())} 원</p>
        `;
    }

    // 전체 상속 계산 함수
    function calculateGroupMode(totalAssetValue) {
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
            const exemption = calculateExemption(relationship, heirAssetValue);
            const taxableAmount = Math.max(heirAssetValue - exemption, 0);
            const tax = calculateTax(taxableAmount);

            return { name, share, assetValue: heirAssetValue, exemption, taxableAmount, tax };
        });

        const totalInheritedAssets = heirs.reduce((sum, heir) => sum + heir.assetValue, 0);

        result.innerHTML = `
            <h3>계산 결과 (전체 상속)</h3>
            <p><strong>상속 재산 합계:</strong> ${formatNumberWithCommas(totalInheritedAssets.toString())} 원</p>
            ${heirs.map(heir => `
                <p>
                    <strong>${heir.name}</strong>: ${formatNumberWithCommas(heir.assetValue.toString())} 원<br>
                    공제 금액: ${formatNumberWithCommas(heir.exemption.toString())} 원<br>
                    과세 금액: ${formatNumberWithCommas(heir.taxableAmount.toString())} 원<br>
                    상속세: ${formatNumberWithCommas(heir.tax.toString())} 원
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

        result.innerHTML = `
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
            const exemption = calculateExemption(relationship, heirAssetValue);
            const taxableAmount = Math.max(heirAssetValue - exemption, 0);
            const tax = calculateTax(taxableAmount);

            return { name, share, assetValue: heirAssetValue, exemption, taxableAmount, tax };
        });

        const totalInheritedAssets = heirs.reduce((sum, heir) => sum + heir.assetValue, 0);

        result.innerHTML = `
            <h3>계산 결과 (가업 단체 상속)</h3>
            <p><strong>상속 재산 합계:</strong> ${formatNumberWithCommas(totalInheritedAssets.toString())} 원</p>
            ${heirs.map(heir => `
                <p>
                    <strong>${heir.name}</strong>: ${formatNumberWithCommas(heir.assetValue.toString())} 원<br>
                    공제 금액: ${formatNumberWithCommas(heir.exemption.toString())} 원<br>
                    과세 금액: ${formatNumberWithCommas(heir.taxableAmount.toString())} 원<br>
                    상속세: ${formatNumberWithCommas(heir.tax.toString())} 원
                </p>
            `).join('')}
        `;
    }

         // 계산 버튼 이벤트
    calculateButton.addEventListener('click', () => {
        const totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
            const value = parseInt(field.value.replace(/,/g, '') || '0', 10);
            return sum + value;
        }, 0);

        switch (inheritanceType.value) {
            case 'personal':
                calculatePersonalMode(totalAssetValue); // 개인 상속 계산
                break;
            case 'group':
                calculateGroupMode(totalAssetValue); // 전체 상속 계산
                break;
            case 'businessPersonal':
                calculateBusinessPersonalMode(totalAssetValue); // 가업 개인 상속 계산
                break;
            case 'businessGroup':
                calculateBusinessGroupMode(totalAssetValue); // 가업 단체 상속 계산
                break;
            default:
                console.error('잘못된 계산 요청');
                break;
        }
    });

    // 숫자 포맷 함수
    function formatNumberWithCommas(value) {
        return parseInt(value.replace(/[^0-9]/g, '') || '0', 10).toLocaleString();
    }
   
});                  
