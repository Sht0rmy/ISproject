import React, { useState } from 'react';

const SpecialCourseCreateForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        room: '',
        instructor: '',
        hours: '',
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await fetch('URL_БЕКЕНД_АПІ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Форма успішно відправлена');
                // Додайте код для подальшої обробки, якщо потрібно
            } else {
                console.error('Помилка відправки форми');
                // Обробка помилки відправки форми, якщо потрібно
            }
        } catch (error) {
            console.error('Помилка виклику API:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Назва:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Кімната:
                <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Викладач:
                <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <label>
                Години:
                <input
                    type="text"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                />
            </label>
            <br />
            <button type="submit">Відправити</button>
        </form>
    );
};

export default SpecialCourseCreateForm;
