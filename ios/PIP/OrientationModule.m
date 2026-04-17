#import <Foundation/Foundation.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import "React/RCTBridgeModule.h"
#endif

@interface RCT_EXTERN_MODULE(OrientationModule, NSObject)

RCT_EXTERN_METHOD(lockToLandscape)
RCT_EXTERN_METHOD(lockToPortrait)

@end
