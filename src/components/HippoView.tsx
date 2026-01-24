// components/HippoView.tsx - React версия с PNG моделями

const BASE_URL = import.meta.env.BASE_URL || '/';

interface HippoViewProps {
    mood?: 'default' | 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water';
    size?: 'small' | 'medium' | 'large';
    age?: 'child' | 'parent';
    gender?: 'male' | 'female';
    costume?: string;
    head?: string;
    upper?: string;
}

// Функция для добавления базового пути
const getAssetPath = (path: string): string => {
    return `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`.replace(/\/+/g, '/');
};

// Функция для получения правильного изображения
const getMoodImage = (mood: string, age: string, costume?: string, head?: string, upper?: string): string => {
    const isParent = age === 'parent';
    
    // Если есть костюм, используем спрайты костюма
    if (costume) {
        if (isParent) {
            // Костюмы для взрослого
            switch (costume) {
                case 'costume_dino':
                    switch (mood) {
                        case 'hunger': return getAssetPath('/models/models/parent/dino/hunger/hunger.png');
                        case 'bath': return getAssetPath('/models/models/parent/dino/bath/bath.png');
                        case 'entertainment': return getAssetPath('/models/models/parent/dino/entertainment/entertainment.png');
                        case 'sleep': return getAssetPath('/models/models/parent/dino/sleep/sleep.png');
                        case 'water': return getAssetPath('/models/models/parent/dino/water/water.png');
                        default: return getAssetPath('/models/models/parent/dino/default.png');
                    }
                case 'costume_duck':
                    switch (mood) {
                        case 'hunger': return getAssetPath('/models/models/parent/duck/hunger/hunger.png');
                        case 'bath': return getAssetPath('/models/models/parent/duck/bath/bath.png');
                        case 'entertainment': return getAssetPath('/models/models/parent/duck/entertainment/entertainment.png');
                        case 'sleep': return getAssetPath('/models/models/parent/duck/sleep/sleep.png');
                        case 'water': return getAssetPath('/models/models/parent/duck/water/water.png');
                        default: return getAssetPath('/models/models/parent/duck/default.png');
                    }
            }
        } else {
            // Костюмы для ребенка
            switch (costume) {
                case 'costume_shark':
                    switch (mood) {
                        case 'hunger': return getAssetPath('/models/models/baby/dino/hunger/hunger.png');
                        case 'bath': return getAssetPath('/models/models/baby/dino/bath/bath.png');
                        case 'entertainment': return getAssetPath('/models/models/baby/dino/entertainment/entertainment.png');
                        case 'sleep': return getAssetPath('/models/models/baby/dino/sleep/sleep.png');
                        case 'water': return getAssetPath('/models/models/baby/dino/water/water.png');
                        default: return '/models/models/baby/dino/default.png';
                    }
                case 'costume_bunny':
                    switch (mood) {
                        case 'hunger': return '/models/models/baby/bunny/hunger/hunger.png';
                        case 'bath': return '/models/models/baby/bunny/bath/bath.png';
                        case 'entertainment': return '/models/models/baby/bunny/entertainment/entertainment.png';
                        case 'sleep': return '/models/models/baby/bunny/sleep/sleep.png';
                        case 'water': return '/models/models/baby/bunny/water/water.png';
                        default: return '/models/models/baby/bunny/default.png';
                    }
                case 'costume_water':
                    switch (mood) {
                        case 'hunger': return '/models/models/baby/water_costume/hunger/hunger.png';
                        case 'bath': return '/models/models/baby/water_costume/bath/bath.png';
                        case 'entertainment': return '/models/models/baby/water_costume/entertainment/entertainment.png';
                        case 'sleep': return '/models/models/baby/water_costume/sleep/sleep.png';
                        case 'water': return '/models/models/baby/water_costume/water/water.png';
                        default: return '/models/models/baby/water_costume/default.png';
                    }
            }
        }
    }
    
    // Проверяем комбинацию боксерских перчаток и заячьих ушек
    const hasBoxing = upper === 'upper_6'; // Боксерские перчатки
    const hasBunnyHat = head === 'hat_6'; // Заячьи ушки
    
    // Только для взрослых
    if (isParent) {
        if (hasBoxing && hasBunnyHat) {
            switch (mood) {
                case 'hunger': return '/models/models/parent/boxing + bunny_hat/hunger/hunger.png';
                case 'bath': return '/models/models/parent/boxing + bunny_hat/bath/bath.png';
                case 'entertainment': return '/models/models/parent/boxing + bunny_hat/entertainment/entertainment.png';
                case 'sleep': return '/models/models/parent/boxing + bunny_hat/sleep/sleep.png';
                case 'water': return '/models/models/parent/boxing + bunny_hat/water/water.png';
                default: return '/models/models/parent/boxing + bunny_hat/default.png';
            }
        }
        
        if (hasBoxing) {
            switch (mood) {
                case 'hunger': return '/models/models/parent/boxing/hunger/hunger.png';
                case 'bath': return '/models/models/parent/boxing/bath/bath.png';
                case 'entertainment': return '/models/models/parent/boxing/entertainment/entertainment.png';
                case 'sleep': return '/models/models/parent/boxing/sleep/sleep.png';
                case 'water': return '/models/models/parent/boxing/water/water.png';
                default: return '/models/models/parent/boxing/default.png';
            }
        }
        
        if (hasBunnyHat) {
            switch (mood) {
                case 'hunger': return '/models/models/parent/bunny_hat/hunger/hunger.png';
                case 'bath': return '/models/models/parent/bunny_hat/bath/bath.png';
                case 'entertainment': return '/models/models/parent/bunny_hat/entertainment/entertainment.png';
                case 'sleep': return '/models/models/parent/bunny_hat/sleep/sleep.png';
                case 'water': return '/models/models/parent/bunny_hat/water/water.png';
                default: return '/models/models/parent/bunny_hat/default.png';
            }
        }
    }
    
    // Обычные спрайты (casual)
    const basePath = isParent ? '/models/models/parent/casual' : '/models/models/baby/casual';
    switch (mood) {
        case 'hunger': return `${basePath}/hunger/hunger.png`;
        case 'bath': return `${basePath}/bath/bath.png`;
        case 'entertainment': return `${basePath}/entertainment/entertainment.png`;
        case 'sleep': return `${basePath}/sleep/sleep.png`;
        case 'water': return `${basePath}/water/water.png`;
        default: return `${basePath}/default.png`;
    }
};

// Размеры для разных типов
const getSizeStyle = (size: string) => {
    switch (size) {
        case 'small':
            return { width: '80px', height: '80px' };
        case 'large':
            return { width: '200px', height: '200px' };
        default: // medium
            return { width: '140px', height: '140px' };
    }
};

export default function HippoView({
    mood = 'default',
    size = 'medium',
    age = 'child',
    gender = 'male',
    costume,
    head,
    upper
}: HippoViewProps) {
    const imageSource = getMoodImage(mood, age, costume, head, upper);
    const sizeStyle = getSizeStyle(size);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <img
                src={imageSource}
                alt="hippo"
                style={{
                    ...sizeStyle,
                    objectFit: 'contain',
                    transform: gender === 'female' ? 'scaleX(-1)' : 'none',
                }}
            />
        </div>
    );
}
