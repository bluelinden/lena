```typescript
import SerialKit from 'serialkit';
import page1 from './page1';

const kit = new SerialKit();
kit.open('div#app');
kit.start(page1);

```