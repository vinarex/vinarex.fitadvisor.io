	// Основная логика рекомендаций
	document.addEventListener('DOMContentLoaded', function() {
		const form = document.getElementById('fitnessForm');
		const resultsSection = document.getElementById('results');
		const questionnaire = document.getElementById('questionnaire');
		const backBtn = document.getElementById('backBtn');
		
		// Базы данных с рекомендациями
		const workoutPrograms = {
			beginner_lose_home: {
				name: "Домашний старт для похудения",
				description: "Программа для новичков, которые хотят похудеть с минимальным оборудованием",
				workouts: [
					"Понедельник: Кардио (20 мин скакалка/бег на месте) + приседания (3x15) + отжимания от пола (3x10)",
					"Среда: Интервальные тренировки (30 сек работа/30 сек отдых) 15 минут + планка (3 подхода по 30 сек)",
					"Пятница: Кардио (20 мин) + выпады (3x12 на каждую ногу) + скручивания (3x15)"
				],
				nutrition: "Дефицит 300-500 ккал, белок 1.5г/кг веса, минимум быстрых углеводов",
				tips: "Пейте 2 литра воды в день, спите 7-8 часов"
			},
			beginner_gain_gym: {
				name: "Базовый набор массы в зале",
				description: "Программа для новичков в тренажерном зале, направленная на рост мышц",
				workouts: [
					"Понедельник: Ноги и спина - приседания, тяга штанги, подтягивания",
					"Среда: Грудь и плечи - жим лежа, жим гантелей, разводки",
					"Пятница: Руки и пресс - подъем штанги на бицепс, французский жим, скручивания"
				],
				nutrition: "Профицит 300-500 ккал, белок 2г/кг веса, сложные углеводы после тренировки",
				tips: "Делайте базовые упражнения, прогрессируйте веса, отдыхайте 2-3 минуты между подходами"
			},
			beginner_maintain_home: {
				name: "Поддержание формы дома",
				description: "Для тех, кто хочет оставаться в тонусе",
				workouts: [
					"Пн: Утренняя зарядка 20 мин + планка 3х30 сек",
					"Ср: Йога/растяжка 30 мин",
					"Пт: Круговая тренировка 25 мин"
				],
				nutrition: "Сбалансированное питание, белок 1.2г/кг",
				tips: "Гуляйте 30 мин в день"
			},

			intermediate_lose_gym: {
				name: "Интенсивное жиросжигание в зале",
				description: "Для продолжающих",
				workouts: [
					"Пн: ВИИТ тренировка 40 мин",
					"Вт: Силовая (ноги, спина)",
					"Чт: Кардио 30 мин + пресс",
					"Сб: Круговая на всё тело"
				],
				nutrition: "Дефицит 20%, белок 1.8г/кг",
				tips: "Меняйте упражнения каждые 4 недели"
			}
		};
		
		// Обработчик отправки формы
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// Собираем данные формы
			const userData = {
				age: parseInt(document.getElementById('age').value),
				gender: document.querySelector('input[name="gender"]:checked').value,
				weight: parseFloat(document.getElementById('weight').value),
				height: parseFloat(document.getElementById('height').value),
				goal: document.getElementById('goal').value,
				level: document.getElementById('level').value,
				place: document.getElementById('place').value,
				time: document.getElementById('time').value
			};
			
			// Генерируем рекомендации
			const recommendations = generateRecommendations(userData);
			
			// Показываем результаты
			displayResults(recommendations, userData);
			
			// Переключаем видимость секций
			questionnaire.style.display = 'none';
			resultsSection.style.display = 'block';
			
			// Прокрутка к результатам
			resultsSection.scrollIntoView({ behavior: 'smooth' });
		});
		
		// Кнопка "Назад"
		backBtn.addEventListener('click', function() {
			resultsSection.style.display = 'none';
			questionnaire.style.display = 'block';
			form.reset();
			questionnaire.scrollIntoView({ behavior: 'smooth' });
		});
		
		function generateRecommendations(data) {
			// 1. Рассчитываем ИМТ
			const heightInMeters = data.height / 100;
			const bmi = (data.weight / (heightInMeters * heightInMeters)).toFixed(1);
			
			// 2. Определяем категорию ИМТ (улучшенная версия)
			let bmiCategory = '';
			if (bmi < 18.5) bmiCategory = 'Недостаточный вес';
			else if (bmi < 24.9) bmiCategory = 'Нормальный вес';
			else if (bmi < 29.9) bmiCategory = 'Избыточный вес';
			else if (bmi < 34.9) bmiCategory = 'Ожирение I степени';
			else if (bmi < 39.9) bmiCategory = 'Ожирение II степени';
			else bmiCategory = 'Ожирение III степени';
			
			// 3. Учитываем возраст
			let ageAdjustment = '';
			if (data.age < 18) ageAdjustment = '_teen';
			else if (data.age > 50) ageAdjustment = '_senior';
			
			// 4. Ищем программу (с учетом возраста)
			let programKey = `${data.level}_${data.goal}_${data.place}${ageAdjustment}`;
			
			// Если нет специальной программы для возраста, ищем общую
			if (!workoutPrograms[programKey]) {
				programKey = `${data.level}_${data.goal}_${data.place}`;
			}
			
			let program = workoutPrograms[programKey];
			
			// 5. Если программы нет - создаем базовую (ИСПРАВЛЕНО!)
			if (!program) {
				program = {
					name: "Универсальная программа",
					description: `Базовая программа для ${data.level === 'beginner' ? 'новичков' : data.level === 'intermediate' ? 'среднего уровня' : 'опытных'}`,
					workouts: data.time === 'low' 
						? ["2 тренировки в неделю по 30 минут", "Кардио 20 минут", "Силовые упражнения с собственным весом"]
						: data.time === 'medium'
						? ["3-4 тренировки в неделю", "Кардио 30 минут", "Силовые упражнения", "Растяжка"]
						: ["4-5 тренировок в неделю", "Кардио 40 минут", "Силовые упражнения с прогрессией", "Интервальные тренировки"],
					nutrition: data.goal === 'lose' 
						? "Дефицит калорий, белок 1.6г/кг, минимум простых углеводов"
						: data.goal === 'gain'
						? "Профицит калорий, белок 2г/кг, сложные углеводы"
						: "Сбалансированное питание, белок 1.5г/кг",
					tips: [
						"Начинайте с разминки",
						"Следите за техникой выполнения",
						"Отдыхайте между тренировками",
						"Пейте достаточно воды"
					]
				};
			}
			
			// 6. Рассчитываем калории (улучшенная формула)
			let bmr = calculateBMR(data);
			let activityFactor = getActivityFactor(data.time, data.level);
			let maintenanceCalories = Math.round(bmr * activityFactor);
			
			// Корректируем по цели
			let calorieTarget;
			switch(data.goal) {
				case 'lose':    // Похудение - умеренный дефицит
					calorieTarget = Math.round(maintenanceCalories * 0.85);
					break;
				case 'gain':    // Набор массы - умеренный профицит
					calorieTarget = Math.round(maintenanceCalories * 1.15);
					break;
				case 'strength': // Сила - небольшой профицит
					calorieTarget = Math.round(maintenanceCalories * 1.1);
					break;
				default:        // Поддержание - БЕЗ изменений
					calorieTarget = maintenanceCalories;
			}
			
			// 7. Минимальные безопасные значения			
			const MIN_CALORIES_FEMALE = 1600;
			const MIN_CALORIES_MALE = 1800;
			
			const minCalories = data.gender === 'female' ? MIN_CALORIES_FEMALE : MIN_CALORIES_MALE;
			
			if (calorieTarget < minCalories) {
				calorieTarget = minCalories;
			}
			
			// 8. Генерируем персонализированные советы
			const nutritionTips = generatePersonalizedTips(data, bmiCategory, calorieTarget);
			const workoutTips = generateWorkoutTips(data, bmiCategory);
			
			return {
				bmi: bmi,
				bmiCategory: bmiCategory,
				calories: Math.round(calorieTarget),
				program: program,
				nutrition: nutritionTips,
				workoutTips: workoutTips,
				ageGroup: getAgeGroup(data.age)
			};
		}

		// Добавьте эти вспомогательные функции в script.js:
		function calculateBMR(data) {
			// Формула Миффлина-Сан Жеора
			if (data.gender === 'male') {
				return 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
			} else {
				return 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
			}
		}

		function getActivityFactor(time, level) {
			// Учитываем и время тренировок, и уровень подготовки
			const baseFactors = {
				'low': 1.375,      // Минимальная активность
				'medium': 1.55, // Умеренная активность
				'high': 1.725     // Высокая активность
			};
			
			let factor = baseFactors[time] || 1.375;
			
			// Корректируем по уровню подготовки
			if (level === 'intermediate') factor *= 1.05;
			if (level === 'advanced') factor *= 1.1;
			
			return factor;
		}

		function generatePersonalizedTips(data, bmiCategory, calories) {
			// Рассчитываем БЖУ в граммах
			let protein, carbs, fat;
			
			// Базовые пропорции в зависимости от цели
			switch(data.goal) {
				case 'lose': // Похудение
					protein = data.weight * 1.8;  // 30% калорий
					fat = data.weight * 0.9;      // 25% калорий
					carbs = (calories - (protein * 4 + fat * 9)) / 4; // 45% калорий
					break;
					
				case 'gain': // Набор массы
					protein = data.weight * 2.0;  // 25% калорий
					fat = data.weight * 1.1;      // 30% калорий
					carbs = (calories - (protein * 4 + fat * 9)) / 4; // 45% калорий
					break;
					
				case 'strength': // Сила
					protein = data.weight * 2.2;  // 30% калорий
					fat = data.weight * 1.0;      // 25% калорий
					carbs = (calories - (protein * 4 + fat * 9)) / 4; // 45% калорий
					break;
					
				default: // Поддержание формы
					protein = data.weight * 1.6;  // 25% калорий
					fat = data.weight * 1.0;      // 30% калорий
					carbs = (calories - (protein * 4 + fat * 9)) / 4; // 45% калорий
			}
			
			// Корректировка по полу
			if (data.gender === 'female') {
				protein *= 0.9;
				carbs *= 0.95;
			}
			
			// Корректировка по возрасту
			if (data.age > 40) {
				protein *= 1.1; // Больше белка для сохранения мышц
				carbs *= 0.9;
			}
			
			// Корректировка по ИМТ
			if (bmiCategory.includes('Ожирение')) {
				protein *= 1.1;
				carbs *= 0.85;
				fat *= 0.9;
			} else if (bmiCategory.includes('Недостаточный')) {
				carbs *= 1.2;
				fat *= 1.1;
			}
			
			// Округляем
			protein = Math.round(protein);
			carbs = Math.round(carbs);
			fat = Math.round(fat);
			
			// Рассчитываем процентное соотношение
			const proteinCals = protein * 4;
			const carbsCals = carbs * 4;
			const fatCals = fat * 9;
			
			const proteinPercent = Math.round((proteinCals / calories) * 100);
			const carbsPercent = Math.round((carbsCals / calories) * 100);
			const fatPercent = Math.round((fatCals / calories) * 100);
			
			// Формируем рекомендации
			const title = data.goal === 'lose' ? "Питание для похудения" :
						  data.goal === 'gain' ? "Питание для набора массы" :
						  data.goal === 'strength' ? "Питание для развития силы" :
						  "Сбалансированное питание";
			
			const items = [
				`Калории: ${Math.round(calories)} ккал/день`,
				`Белки: ${protein} г (${proteinPercent}%) — мясо, рыба, яйца, творог`,
				`Углеводы: ${carbs} г (${carbsPercent}%) — крупы, макароны, хлеб, фрукты`,
				`Жиры: ${fat} г (${fatPercent}%) — орехи, авокадо, оливковое масло`
			];
			
			// Добавляем специфические советы
			const specificTips = [];
			
			if (data.goal === 'lose') {
				specificTips.push("Создайте дефицит 300-500 ккал от нормы");
				specificTips.push("Ешьте больше овощей (минимум 400 г в день)");
				specificTips.push("Исключите сладкие напитки и сахар");
				specificTips.push("Пейте воду за 30 мин до еды");
			} else if (data.goal === 'gain') {
				specificTips.push("Создайте профицит 300-500 ккал");
				specificTips.push("Прием пищи каждые 3-4 часа");
				specificTips.push("Углеводы после тренировки");
				specificTips.push("Перед сном - казеиновый белок (творог)");
			}
			
			// Советы по времени тренировок
			if (data.time === 'low') {
				specificTips.push("При 2-3 тренировках в неделю: делайте упор на качество питания");
			} else if (data.time === 'high') {
				specificTips.push("При 5+ тренировках: увеличьте углеводы перед тренировкой");
			}
			
			// Вода
			const water = Math.round(data.weight * 33);
			items.push(`Вода: ${water} мл/день (${Math.round(water / 250)} стаканов)`);
			
			// Добавляем все советы
			items.push(...specificTips);
			
			return {
				title: title,
				items: items,
				macronutrients: {
					protein: protein,
					carbs: carbs,
					fat: fat,
					calories: Math.round(calories)
				}
			};
		}
		
		// Генератор советов по питанию
		function generateNutritionTips(goal, weight) {
			const protein = goal === 'gain' ? weight * 2 : weight * 1.5;
			
			const tips = {
				lose: {
					title: "Для похудения",
					items: [
						`Потребляйте ${protein.toFixed(0)}г белка в день`,
						"Ешьте больше овощей и клетчатки",
						"Пейте воду перед едой",
						"Избегайте сахара и сладких напитков"
					]
				},
				gain: {
					title: "Для набора массы",
					items: [
						`Потребляйте ${protein.toFixed(0)}г белка в день`,
						"Ешьте 4-6 раз в день",
						"Углеводы после тренировки",
						"Здоровые жиры (орехи, авокадо)"
					]
				},
				maintain: {
					title: "Для поддержания формы",
					items: [
						"Сбалансированное питание",
						"Белок 1.2-1.5г на кг веса",
						"5 порций овощей и фруктов в день",
						"Пейте достаточно воды"
					]
				}
			};
			
			return tips[goal] || tips.maintain;
		}
		
		// Отображение результатов
		function displayResults(rec, userData) {
			// Имя программы
			document.getElementById('programName').textContent = rec.program.name;
			
			// Бейджи
			const badges = document.getElementById('badges');
			badges.innerHTML = `
				<span class="badge">${userData.level === 'beginner' ? 'Новичок' : userData.level === 'intermediate' ? 'Средний' : 'Опытный'}</span>
				<span class="badge">${userData.place === 'home' ? 'Дом' : userData.place === 'gym' ? 'Зал' : 'Без оборудования'}</span>
				<span class="badge">${rec.bmiCategory}</span>
			`;
			
			// ИМТ и калории
			document.getElementById('bmiInfo').innerHTML = `
				<strong>ИМТ:</strong> ${rec.bmi} (${rec.bmiCategory})<br>
				<small>Индекс массы тела показывает соответствие веса и роста</small>
			`;
			
			document.getElementById('calorieInfo').innerHTML = `
				<strong>Рекомендуемое количество калорий:</strong> ${rec.calories} ккал/день<br>
				<small>Для ${userData.goal === 'lose' ? 'похудения' : userData.goal === 'gain' ? 'набора массы' : 'поддержания веса'}</small>
			`;
			
			let bmiAdvice = '';
			if (rec.bmiCategory.includes('Недостаточный')) {
				bmiAdvice = 'Рекомендуется увеличить калорийность питания для набора массы';
			} else if (rec.bmiCategory.includes('Нормальный')) {
				bmiAdvice = 'Ваш вес в норме. Поддерживайте текущий режим';
			} else if (rec.bmiCategory.includes('Избыточный')) {
				bmiAdvice = 'Рекомендуется умеренный дефицит калорий и кардио-нагрузки';
			} else {
				bmiAdvice = 'Проконсультируйтесь с врачом перед началом тренировок';
			}

			document.getElementById('bmiInfo').innerHTML = `
				<strong>ИМТ:</strong> ${rec.bmi} (${rec.bmiCategory})<br>
				<small>${bmiAdvice}</small>
			`;			
					
			// План тренировок
			let workoutHTML;
			if (Array.isArray(rec.program.workouts)) {
				workoutHTML = `
					<p><strong>${rec.program.description}</strong></p>
					<ul>
						${rec.program.workouts.map(workout => `<li>${workout}</li>`).join('')}
					</ul>
				`;
			} else if (typeof rec.program.workouts === 'string') {
				workoutHTML = `
					<p><strong>${rec.program.description}</strong></p>
					<p>${rec.program.workouts}</p>
				`;
			} else {
				workoutHTML = `
					<p><strong>${rec.program.description}</strong></p>
					<p>Тренировки 3 раза в неделю, кардио 2 раза в неделю</p>
				`;
			}
			document.getElementById('workoutPlan').innerHTML = workoutHTML;
			
			// Питание
			let nutritionHTML;

			// Вариант 1: Если nutrition - это объект с title и items (новый формат)
			if (rec.nutrition && rec.nutrition.title && Array.isArray(rec.nutrition.items)) {
				// Создаем красивую таблицу КБЖУ если есть данные
				let macroTable = '';
				if (rec.nutrition.macronutrients) {
					const m = rec.nutrition.macronutrients;
					macroTable = `
						<div class="macro-grid">
							<div class="macro-item">
								<div class="macro-value">${m.calories}</div>
								<div class="macro-label">Ккал</div>
							</div>
							<div class="macro-item">
								<div class="macro-value">${m.protein}г</div>
								<div class="macro-label">Белки</div>
							</div>
							<div class="macro-item">
								<div class="macro-value">${m.carbs}г</div>
								<div class="macro-label">Углеводы</div>
							</div>
							<div class="macro-item">
								<div class="macro-value">${m.fat}г</div>
								<div class="macro-label">Жиры</div>
							</div>
						</div>
					`;
				}
				
				nutritionHTML = `
					<p><strong>${rec.nutrition.title}</strong></p>
					${macroTable}
					<ul>
						${rec.nutrition.items.map(item => `<li>${item}</li>`).join('')}
					</ul>
				`;
			}

			// Вариант 2: Если nutrition - просто строка (старый формат)
			else if (rec.nutrition && typeof rec.nutrition === 'string') {
				nutritionHTML = `
					<p><strong>Рекомендации по питанию</strong></p>
					<p>${rec.nutrition}</p>
				`;
			}

		// Вариант 3: Если nutrition - объект с полями protein, water и т.д.
		else if (rec.nutrition && (rec.nutrition.protein || rec.nutrition.water)) {
			const tips = [];
			if (rec.nutrition.protein) tips.push(`<li>${rec.nutrition.protein}</li>`);
			if (rec.nutrition.water) tips.push(`<li>${rec.nutrition.water}</li>`);
			if (rec.nutrition.special) tips.push(`<li>${rec.nutrition.special}</li>`);
			if (rec.nutrition.age) tips.push(`<li>${rec.nutrition.age}</li>`);
			
			nutritionHTML = `
				<p><strong>Персональные рекомендации по питанию</strong></p>
				<ul>${tips.join('')}</ul>
			`;
		}

		// Вариант 4: Запасной вариант (если ничего не подошло)
		else {
			nutritionHTML = `
				<p><strong>Общие рекомендации по питанию</strong></p>
				<ul>
					<li>Сбалансированное питание</li>
					<li>Белок 1.5г на кг веса</li>
					<li>5 порций овощей и фруктов в день</li>
					<li>Пейте 2 литра воды в день</li>
				</ul>
			`;
		}

		// Вставляем HTML в страницу
		document.getElementById('nutritionTips').innerHTML = nutritionHTML;
			
			// Дополнительные советы
			let extraTipsHTML;
			if (Array.isArray(rec.program.tips)) {
				extraTipsHTML = `
					<ul>
						${rec.program.tips.map(tip => `<li>${tip}</li>`).join('')}
						${rec.workoutTips ? rec.workoutTips.map(tip => `<li>${tip}</li>`).join('') : ''}
					</ul>
				`;
			} else if (typeof rec.program.tips === 'string') {
				extraTipsHTML = `
					<ul>
						<li>${rec.program.tips}</li>
						${rec.workoutTips ? rec.workoutTips.map(tip => `<li>${tip}</li>`).join('') : ''}
					</ul>
				`;
			} else {
				extraTipsHTML = `
					<ul>
						<li>${rec.program.tips || 'Начинайте с легких нагрузок'}</li>
						<li>Следите за техникой выполнения упражнений</li>
						<li>Отдыхайте достаточно между тренировками</li>
					</ul>
				`;
			}
			document.getElementById('extraTips').innerHTML = extraTipsHTML;
		}
		
		// Вспомогательные функции
		function getAgeGroup(age) {
			if (age < 18) return 'подросток';
			if (age < 30) return 'молодой взрослый';
			if (age < 50) return 'взрослый';
			return 'старший возраст';
		}

		function generateWorkoutTips(data, bmiCategory) {
			let tips = [];
			
			// Советы по ИМТ
			if (bmiCategory.includes('Недостаточный')) {
				tips.push('Делайте упор на силовые тренировки для набора мышечной массы');
				tips.push('Увеличьте калорийность питания');
			} else if (bmiCategory.includes('Избыточный') || bmiCategory.includes('Ожирение')) {
				tips.push('Начинайте с низкоударного кардио (ходьба, велосипед)');
				tips.push('Включайте упражнения на все группы мышц');
				tips.push('Избегайте прыжковых упражнений при ИМТ > 30');
			}
			
			// Советы по возрасту
			if (data.age > 45) {
				tips.push('Добавьте упражнения на баланс и координацию');
				tips.push('Уделяйте больше времени разминке и заминке');
				tips.push('Избегайте упражнений с осевой нагрузкой на позвоночник');
			}
			
			// Советы по полу
			if (data.gender === 'female') {
				tips.push('Уделяйте внимание упражнениям для нижней части тела');
				tips.push('Работайте над укреплением мышц кора');
			}
			
			return tips;
		}
	});